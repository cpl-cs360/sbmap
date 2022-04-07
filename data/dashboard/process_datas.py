import pandas as pd

'''
    Data should be formatted as follows:

    {
        id: String,
        distances: List<a>,
        diameters: List<a, diameter>,
        orbits: List<a, e>,
    }
'''

path_to_csv = '/Users/colmlang/CS360/final/finalProject/data/dashboard/asteroid_a_e_diameter.csv'
df = pd.read_csv(path_to_csv).sort_values(by=['a'])

ids = ['hun', 'main', 'hild', 'troj']
thresholds = [
    [1.7,2],
    [2.3,3.3],
    [3.7,4.2],
    [5.05, 5.4]
]
data = {
    'id': [],
    'a': [],
    'e': [],
    'diameter': [],
}

def get_id(a):
    for i in range(len(thresholds)):
        if a >= thresholds[i][0] and a <= thresholds[i][1]:
            return ids[i]
    return -1

for index, row in df.iterrows():
    a = (float)(row['a'])
    id = get_id(a)
    if id == -1:
        continue
    diameter = (float)(row['diameter'])
    e = (float)(row['e'])

    data['id'].append(id)
    data['a'].append(a)
    data['e'].append(e)
    data['diameter'].append(diameter)
    
df = pd.DataFrame(data).sort_values(by=['id'])
df.to_csv('dashboard_data.csv', header=data.keys(), index=False)