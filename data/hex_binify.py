# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
# We hope to plot all orbital ellipses for the dataset 
# and calculate the corresponding hex bin values herein
# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ 

import matplotlib.pyplot as plt
import pandas as pd
import math
from datetime import datetime

# first we populate our dataframe
path_to_csv = "/Users/colmlang/CS360/final/finalProject/data/asteroid_orbit_params_a_e_peri_Q_0au_to_8au.csv"
df = pd.read_csv(path_to_csv)

max_aphelion = df['ad'].max()

NUM_ROWS = NUM_COLS = 100
hexes = {}
for i in range(NUM_COLS):
    for j in range(NUM_ROWS):
        hexes[str(i) + "," + str(j)] = 0

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

    left_bound = (int)(0 - c - a)
    right_bound = (int)(a - c)

    for x in range(left_bound, right_bound):
        ys = get_y(x)
        for y in ys:
            points.append((x, y))

    # before returning we shall rotate all points then translate the set to the center of the canvas
    def rotate_then_translate(point):
        point = rotate((0,0), point, w)
        point = translate_to_center(point)
        return point

    return list(map(rotate_then_translate, points))

# returns the hex bin where the point is. 
def get_hex_by_point(point):
    px, py = point
    r = (1000 / NUM_COLS) / 2
    base_width = 2 * r
    """
            2 (60,120)
    3 (120,180)      1 (0, 60)

    4 (180, 240)     6 (300,360)
            5 (240,300)
    """


def update_hex_bins_by_points(points):
    hexbins = plt.hexbin(
        list(map(lambda p: p[0], points)),  # x
        list(map(lambda p: p[1], points)),  # y
        gridsize=(100,100),                 # number of hexes by x and y
        extent=(0,1000,0,1000)              # extent: (xmin, xmax, ymin, ymax)
    )
    found_hexes = {}

    for point in points:
        key = get_hex_by_point(point)
        if found_hexes.get(key) != True:                # if we havent updated this hex yet    
            found_hexes.update( {key: True} )           # first add it to the set of found hexes to prevent repeats
            hexes.update( {key: 1 if hexes.get(key) == None else (hexes.get(key) + 1)} )   # increment hex count


# for each body in the dataset
print('loading...')
start = datetime.now()
all_points = []
for index, row in df.iterrows():
    a = (float)(row['a'])
    e = (float)(row['e'])
    w = (float)(row['w'])
    points = get_points_in_ellipse(x_scale(a), e, w)
    # update_hex_bins_by_points(points)
    all_points += points
end = datetime.now()
print("runtime:")
print(end - start)

# points= [(1,1), (999, 0), (200,100), (500,500), (0, 999), (999,999)]
hexbins = plt.hexbin(
    list(map(lambda p: p[0], all_points)),  # x
    list(map(lambda p: p[1], all_points)),  # y
    gridsize=100,                           # number of hexes by x and y
    extent=(0,1000,0,1000)                  # extent: (xmin, xmax, ymin, ymax)
)

plt.show()