import math
import pandas as pd

path_to_csv = "/Users/colmlang/CS360/final/finalProject/data/violinPlot/asteroids_a.csv"
df = pd.read_csv(path_to_csv)
min_bin = math.floor(min(df['a']))
max_bin = math.ceil(max(df['a']))

bins = {}
i = (float)(min_bin)
while i < max_bin:
    bins.update( {i: 0} )
    i = round(i + 0.025, 3)

for a in df['a']:
    key = round(math.floor((float)(a) * 40) / 40, 3)
    bins.update( {key: bins.get(key) + 1} )

bin_data = {
    "bin": list(bins.keys()),
    "count": list(bins.values())
}

bin_df = pd.DataFrame(bin_data).sort_values(by=['bin'])
bin_df.to_csv("asteroid_a_bins_0.025.csv", header=['bin', 'count'], index=False)