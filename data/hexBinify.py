numRows = 600
numCols = 450

# dictionary of hex-bin counts
# Key : String ("x,y")
# Value : Int (count)
count_by_hex = {}

# init dictionary of hex bins
for i in range(0, numCols):
    for j in range(0, numRows):
        count_by_hex.update({i + "," + j: 0})


