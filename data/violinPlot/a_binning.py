import math
import pandas as pd

path_to_csv = "/Users/colmlang/CS360/final/finalProject/data/violinPlot/asteroids_a.csv"
df = pd.read_csv(path_to_csv)
min_bin = math.floor(min(df['a']))
max_bin = math.ceil(max(df['a']))

ids = ['hun', 'main', 'hild', 'troj']
thresholds = [
    [1.7, 2],
    [2.05, 3.3],
    [3.7, 4.2],
    [5.05, 5.4]
]

bins = {}
i = (float)(min_bin)
while i < max_bin:
    bins.update( {i: {}} )
    for id in ids:
        bins[i].update( {id: 0} )

    i = round(i + 0.025, 3)

for a in df['a']:
    a = (float)(a)
    key = round(math.floor(a * 40) / 40, 3)

    for i in range(len(thresholds)):
        if a >= thresholds[i][0] and a <= thresholds[i][1]:
            bins[key][ids[i]] += 1


bin_data = {
    'bin': list(bins.keys()),
}
for id in ids:
    bin_data.update( {id: list(map(lambda x: x.get(id), list(bins.values())))} )

bin_df = pd.DataFrame(bin_data)
bin_df.to_csv("asteroid_a_bins_0.025_by_id.csv", index=False)