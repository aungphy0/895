import os,json

def generate_truth_label(data):

    filename = os.listdir(data)

    label = []

    for f in filename:
        label_name = []
        name = f.split(']')
        l_name = name[0][2:-1]
        label_name.append(l_name)
        label.append(label_name)

    output_file = "truth1.json"

    with open(output_file, "w") as json_file:
        json.dump(label, json_file, indent=4)


    print(label)

generate_truth_label("./dataset1")
