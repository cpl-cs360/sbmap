# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
# We hope to plot all orbital ellipses for the dataset 
# and calculate the corresponding hex bin values herein
# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ 

from operator import itemgetter
import matplotlib.pyplot as plt
import pandas as pd
import math
from datetime import datetime
from tqdm import tqdm

# first we populate our dataframe
path_to_csv = "/Users/colmlang/CS360/final/finalProject/data/asteroid_orbit_params_a_e_peri_Q_0au_to_8au.csv"
df = pd.read_csv(path_to_csv)

max_aphelion = df['ad'].max()

# init empty hex bins for population in main loop
hexes = plt.hexbin(
    [],
    [],
    gridsize=100,
    extent=(0,1000,0,1000)
)

# returns some scaled x valued based on specified domain and range
def x_scale(x):
    # domain = [0, max_aphelion]
    # range = [0, 500]
    # our canvas shall be, arbitrarily, 1000px by 1000px (therefore a max of 500px from the center)
    # x / max_domain = output / max_range
    return (x * 500) / max_aphelion

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

def update_hex_bins_by_points(points):
    current_bins = plt.hexbin(
        list(map(itemgetter(0), points)),     # x
        list(map(itemgetter(1), points)),     # y
        gridsize=100,                   # number of hexes x by y
        extent=(0,1000,0,1000)          # extent (min_w, max_w, min_y, max_y)
    )
    bins_arr = current_bins.get_array()
    updated_bins = hexes.get_array()

    for i in range(len(bins_arr)):
        updated_bins[i] += 1 if bins_arr[i] > 0 else 0
    hexes.set_array(updated_bins)

# for each body in the dataset
for index, row in tqdm(df.iterrows(), total=df.shape[0]):
    points = get_points_in_ellipse(x_scale((float)(row['a'])), (float)(row['e']), (float)(row['w']))
    update_hex_bins_by_points(points)

offsets = hexes.get_offsets()
count_arr = hexes.get_array()
hexes = plt.hexbin(
    offsets[:,0],
    offsets[:,1],
    C=count_arr,
    gridsize=100,
    extent=(0,1000,0,1000)
)

# get concise dict of hex bin data
hex_data = { 
    'x': offsets[:,0], 
    'y': offsets[:,1], 
    'count': count_arr 
}

# construct sorted dataframe (by x then by y)
hex_df = pd.DataFrame(hex_data).sort_values(by=['x', 'y'])

# write to csv with headers and no index
hex_df.to_csv('hex_bins.csv', header=hex_data.keys(), index=False)