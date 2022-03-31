# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
# We hope to plot all orbital ellipses for the dataset 
# and calculate the corresponding hex bin values herein
# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ 

import gc
from multiprocessing.dummy import freeze_support
from operator import itemgetter
import matplotlib
import matplotlib.pyplot as plt
import pandas as pd
import math
import time
from tqdm import tqdm
import multiprocessing
import concurrent.futures
matplotlib.use('agg')

matplotlib.use('agg')   # this fixes the memory leak

# first we populate our dataframe
path_to_csv = r"C:\Users\Colml\Desktop\final\data\hexbin\asteroid_orbit_params_a_e_peri_Q_0au_to_8au.csv"
df = pd.read_csv(path_to_csv)

max_aphelion = df['ad'].max()

# init empty hex bins for population in main loop
hexes = plt.hexbin(
    [],
    [],
    gridsize=125,
    extent=(0,1000,0,1000)
)

# returns some scaled x valued based on specified domain and range
def x_scale(x):
    # domain = [0, max_aphelion]
    # range = [0, 500]
    # our canvas shall be, arbitrarily, 1000px by 1000px (therefore a max of 500px from the center)
    # x / max_domain = output / max_range
    return (x * 500) / math.floor(max_aphelion)

def rotate(origin, point, angle):
    """
    Rotate a point counterclockwise by a given angle around a given origin.

    The angle should be given in radians.
    By: Mark Dickinson
    """
    angle = math.radians(angle)
    ox, oy = origin
    px, py = point

    qx = ox + math.cos(angle) * (px - ox) - math.sin(angle) * (py - oy)
    qy = oy + math.sin(angle) * (px - ox) + math.cos(angle) * (py - oy)

    return qx, qy

def translate_to_center(point):
    px, py = point
    return (px + 500, py + 500)

def get_points_in_ellipse(a, e, w):
    b = a * math.sqrt(1 - (e * e))      # b = semi-minor axis (or y radius)
    c = math.sqrt((a * a) - (b * b))    # c = the distance of the foci from the center

    points = []

    # Function for a horizontal ellipse with the sun's focus at (0, 0)
    def get_y(x):
        h, k = (-c, 0)
        # ((x - h)^2 / a^2) + ((y - k)^2 / b^ 2) = 1
        # ((y - k)^2 / b^ 2) = 1 - ((x - h)^2 / a^2)
        # (y - k)^2 = (1 - ((x - h)^2 / a^2)) * b^2
        # therefore y = sqrt((1 - (x - h)^2 / a^2)) * b^2) + k
        under_sqrt = (1 - (pow(x - h, 2) / (a * a))) * b * b
        if under_sqrt < 0:
            return []
        y1 = math.sqrt(under_sqrt) + k      # top half of ellipse
        y2 = y1 * -1                        # bottom half
        return [y1] if y1 == y2 else [y1, y2]

    left_bound = 0 - c - a
    right_bound = a - c
    
    for y in get_y(left_bound):
        points.append((left_bound, y))
    for y in get_y(right_bound):
        points.append((right_bound, y))

    x = left_bound + 0.01
    while x < right_bound:
        ys = get_y(x)
        for y in ys:
            points.append((x, y))
        x += 0.01

    # before returning we shall rotate all points then translate the set to the center of the canvas
    def rotate_then_translate(point):
        point = rotate((0,0), point, w)
        point = translate_to_center(point)
        return point

    return list(map(rotate_then_translate, points))

def get_hex_bins_by_points(points):
    current_bins = plt.hexbin(
        list(map(itemgetter(0), points)),       # x
        list(map(itemgetter(1), points)),       # y
        gridsize=125,                           # number of hexes x by y
        extent=(0,1000,0,1000)                  # extent (min_w, max_w, min_y, max_y)
    )
    bins_arr = current_bins.get_array()

    for i in range(len(bins_arr)):
        if bins_arr[i] > 0:
            bins_arr[i] = 1

    del current_bins    # to prevent memory leak
    plt.close('all')
    plt.close()
    gc.collect()
    return bins_arr

# for each body in the dataset
def compute(i, total):
    state = [
        [0 for _ in range(len(hexes.get_array()))],         # COUNT_ARR init to zeros
        [[] for _ in range(len(hexes.get_array()))],        # IDS_ARR init to empty sets
        []                                                  # ORBITS_ARR
    ]

    for index, row in tqdm(df.iterrows(), total=df.shape[0]):
        # if not current processor's section, continue
        if index % total != i:
            continue
        points = get_points_in_ellipse(x_scale((float)(row['a'])), (float)(row['e']), (float)(row['w']))
        set_of_bins = get_hex_bins_by_points(points)

        for j in range(len(set_of_bins)):
            curr = set_of_bins[j]
            state[0][j] += curr                         # counts[j] += curr

            if curr == 1 and index % 100 == 0 and len(state['ids'][j]) < 20:     # if this orbit passed through this hex and is a selected orbit and there are less than 25 ids saved
                state['ids'][j].append(index)                                    # add its id to the set of ids
                
        if index % 100 == 0:                                                     # this is data sampling so that we only have some orbits, not all 1.2 million
            a = x_scale((float)(row['a']))
            e = (float)(row['e'])
            b = a * math.sqrt(1 - e * e)
            state["orbits"].append({
                "id": index,
                "a": a,
                "b": b,
                "c": math.sqrt(a * a - b * b),
                "e": e,
                "w": row['w']
            })

    return state


if __name__ == '__main__':
    freeze_support()

    num_cpus = multiprocessing.cpu_count() - 1

    print(f"Starting processing on {num_cpus} cpus")
    start = time.perf_counter()

    aggregate_count_arr = [0 for _ in range(len(hexes.get_array()))]    # to add up each hexbin's result from all seperate cpu results
    aggregate_id_arr = [[] for _ in range(len(hexes.get_array()))]      # to keep track of the orbit's that intersect each hexbin's orbit 
    orbit_data = {
        'id': [],
        'a': [],
        'b': [],
        'c': [],
        'e': [],
        'w': []
    }
    with concurrent.futures.ProcessPoolExecutor() as executor:
        results = [executor.submit(compute, i, num_cpus) for i in range(num_cpus)]
        
        for f in concurrent.futures.as_completed(results):
            resultState = f.result()                                # in the format: { counts, ids, orbits }
            
            for orbit in resultState[2]:                            # update new orbits
                orbit_data['id'].append(orbit[0])
                orbit_data['a'].append(orbit[1])
                orbit_data['e'].append(orbit[2])
                orbit_data['w'].append(orbit[3])

            for i in range(len(resultState[0])):
                aggregate_count_arr[i] += resultState[0][i]         # update current bin's count
                aggregate_id_arr[i] += resultState[1][i]            # append the set of intersecting ids to the current bin

    offsets = hexes.get_offsets()
    # get concise dict of hex bin data
    hex_data = { 
        'x': offsets[:,0], 
        'y': offsets[:,1], 
        'count': aggregate_count_arr,
        'ids': aggregate_id_arr
    }

    # construct sorted dataframe (by x then by y)
    hex_df = pd.DataFrame(hex_data).sort_values(by=['x', 'y'])
    orbits_df = pd.DataFrame(orbit_data).sort_values(by=['id'])

    # write to csv with headers and no index
    hex_df.to_csv('./hex_bins_125.csv', header=hex_data.keys(), index=False)
    orbits_df.to_csv('./orbits_125.csv', header=orbit_data.keys(), index=False)

    end = time.perf_counter()
    print(f"Program completed in {end - start} seconds")
