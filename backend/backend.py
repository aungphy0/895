from flask import Flask, jsonify, request
from flask import Flask, render_template

from flask_cors import CORS
from torchvision import models
import torch
from PIL import Image
from torchvision import transforms
import json
import os

import random
import glob
from skimage import io, transform
from torchvision import transforms

app = Flask(__name__)
CORS(app)


############ AlexNet ################
def generate_alex_net(data, truth):

    modified_data = []

    values=[]

    img_dir = data
    data_path = os.path.join(img_dir,'*g')
    files = glob.glob(data_path)
    data = []
    predictions=[]

    truth_file = open(truth,"r")
    true= json.loads(truth_file.read())
    class_file = open('./classes.json',"r")
    classes= json.loads(class_file.read())[0]

#alexnet, mobilenet_v3_small shufflenet_v2_x1_0 squeezenet1_0 mnasnet0_5 squeezenet1_1

    CNN = models.alexnet(pretrained=True)

    images=[]

    for f1 in files:
        data.append(f1)
    conv_image=[]

    transform = transforms.Compose([
        transforms.Resize(256),
        transforms.CenterCrop(224),
        transforms.ToTensor()   ,
        transforms.Normalize(
        mean = [.485, .456, .406],
        std= [.229, .224, .225])
        ])
    for i in range(len(data)):
        img=Image.open(data[i])
        img.resize((256,256))
        img = transform(img)
        images.append(torch.unsqueeze(img,0))
        CNN.eval()

    for i in range (len(images)):
        conv_image.append(CNN(images[i]))
    names=[]
    preds=[]
    total_per=[]
    # for i in range (len(conv_image)):
    for i in range(len(conv_image)):
        conv=conv_image[i]

        # print("********************************************")
        # print(conv[0][1])

        _, indices = torch.sort(conv, descending=True)
        percentage = torch.nn.functional.softmax(conv, dim=1)[0] # * 100
        per=[]

        print("********************************************")
        print(percentage[0].item())

        print("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&")
        print(indices[0])
        name = str([(classes[idx]) for idx in indices[0][:1]])

        string = ""
        string2=""
        string+=true[i][0]
        for z in range(len(true[i])-1):
            string+=", "
            string+=true[i][z+1]

        for z in range(len(name)-4):
            string2+=name[z+2]

        names.append(string2)
        if(string==(string2)):

            predictions.append(1)
        else:
            predictions.append(0)

        strin="img"
        strin+=""+str(i)+""
        strin+=".jpg"

        print("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@")
        print(strin)

        # for idx in indices[0]:
        #     per.append(percentage[idx].item())
        # totPercent=[]
        # total_per.append(per)

        for i in range(len(percentage)):
            per.append(percentage[i].item())
        totPercent=[]
        total_per.append(per)

        # print(max(per))
        print("#########################################")
        print(per)
        print(len(per))

        entry = {
            "name": strin,
            "probabilities": per,
        }

        modified_data.append(entry)

        preds.append(max(per))
        for l in range(len(per)):

            totPercent.append(per[l])

    json_data = json.dumps(values)

    with open('alexnet.json', 'w') as f:
        f.write(json_data)

    ans = 0
    for i in range(len(predictions)):
        if(predictions[i]==1):
            ans+=1

    print(ans)
    print(len(predictions))
    print(len(preds))


    # modified_data = {
    #     "data": []
    # }


    # for i in range(len(predictions)):
    #     image_path = data[i]
    #     image_filename = os.path.basename(image_path)
    #     image_name = image_filename[-10:]
    #     true_labels = ", ".join(true[i])
    #     accuracy = False
    #     if (true_labels==names[i]):
    #         accuracy=True
    #     entry = {
    #         "image_name": image_name,
    #         "true_label": true_labels,
    #         "predicted_label_model_Alexnet": f" {names[i]}",
    #         "confidence_model_AlexNet_result": preds[i]/100,
    #         "Alex_Net_accuracy":accuracy,
    #
    #     }
    #
    #
    #
    #     modified_data["data"].append(entry)
    #
    # print(per)


    x=0

    # output_json_file = "Alex_Net_values.json"
    output_json_file = "Alexnet_values_one.json"

    with open(output_json_file, "w") as json_file:
        json.dump(modified_data, json_file, indent=4)

    print(f"The modified data has been written to '{output_json_file}'.")
    output_dir = "class_json_files"
    os.makedirs(output_dir, exist_ok=True)


    for class_idx in range(1000):
        class_name = classes[class_idx]
        class_filename = os.path.join(output_dir, f"class_{class_name}.json")


        class_data = []

        for i in range(len(total_per)):
            image_name = f"img{i}.jpg"
            accuracy = total_per[i][class_idx]
            maxi= preds[i]


            image_entry = {
                "image_name": image_name,
                "accuracy": accuracy,
                "max": maxi

            }


            class_data.append(image_entry)


        with open(class_filename, "w") as json_file:
            json.dump(class_data, json_file, indent=4)

    print("Individual JSON files created for each class.")


################# MobileNet ########################
def generate_mobile_net(data, truth):


    modified_data = []

    values=[]

    img_dir = data
    data_path = os.path.join(img_dir,'*g')
    files = glob.glob(data_path)
    data = []
    predictions=[]

    truth_file = open(truth,"r")
    true= json.loads(truth_file.read())
    class_file = open('./classes.json',"r")
    classes= json.loads(class_file.read())[0]

#alexnet, mobilenet_v3_small shufflenet_v2_x1_0 squeezenet1_0 mnasnet0_5 squeezenet1_1

    CNN = models.mobilenet_v3_small(pretrained=True)

    images=[]

    for f1 in files:
        data.append(f1)
    conv_image=[]

    transform = transforms.Compose([
        transforms.Resize(256),
        transforms.CenterCrop(224),
        transforms.ToTensor()   ,
        transforms.Normalize(
        mean = [.485, .456, .406],
        std= [.229, .224, .225])
        ])
    for i in range(len(data)):
        img=Image.open(data[i])
        img.resize((256,256))
        img = transform(img)
        images.append(torch.unsqueeze(img,0))
        CNN.eval()

    for i in range (len(images)):
        conv_image.append(CNN(images[i]))
    names=[]
    preds=[]
    total_per=[]
    # for i in range (len(conv_image)):
    for i in range(len(conv_image)):
        conv=conv_image[i]

        _, indices = torch.sort(conv, descending=True)
        percentage = torch.nn.functional.softmax(conv, dim=1)[0] # * 100
        per=[]


        name = str([(classes[idx]) for idx in indices[0][:1]])

        string = ""
        string2=""
        string+=true[i][0]
        for z in range(len(true[i])-1):
            string+=", "
            string+=true[i][z+1]

        for z in range(len(name)-4):
            string2+=name[z+2]

        names.append(string2)
        if(string==(string2)):

            predictions.append(1)
        else:
            predictions.append(0)

        strin="img"
        strin+=""+str(i)+""
        strin+=".jpg"

        # for idx in indices[0]:
        #     per.append(percentage[idx].item())
        # totPercent=[]
        # total_per.append(per)

        for i in range(len(percentage)):
            per.append(percentage[i].item())
        totPercent=[]
        total_per.append(per)


        print(max(per))

        entry = {
            "name": strin,
            "probabilities": per,
        }

        modified_data.append(entry)

        preds.append(max(per))
        for l in range(len(per)):

            totPercent.append(per[l])

    json_data = json.dumps(values)

    with open('mobilenet.json', 'w') as f:
        f.write(json_data)

    ans = 0
    for i in range(len(predictions)):
        if(predictions[i]==1):
            ans+=1

    print(ans)
    print(len(predictions))
    print(len(preds))


    # modified_data = {
    #     "data": []
    # }
    #
    #
    # for i in range(len(predictions)):
    #     image_path = data[i]
    #     image_filename = os.path.basename(image_path)
    #     image_name = image_filename[-10:]
    #     true_labels = ", ".join(true[i])
    #     accuracy = False
    #     if (true_labels==names[i]):
    #         accuracy=True
    #     entry = {
    #         "image_name": image_name,
    #         "true_label": true_labels,
    #         "predicted_label_model_Mobilenet": f" {names[i]}",
    #         "confidence_model_MobileNet_result": preds[i]/100,
    #         "Mobile_Net_accuracy":accuracy,
    #
    #     }
    #
    #
    #
    #     modified_data["data"].append(entry)
    #
    # print(per)


    x=0

    output_json_file = "Mobilenet_values_one.json"

    with open(output_json_file, "w") as json_file:
        json.dump(modified_data, json_file, indent=4)

    print(f"The modified data has been written to '{output_json_file}'.")
    output_dir = "class_json_files"
    os.makedirs(output_dir, exist_ok=True)


    for class_idx in range(1000):
        class_name = classes[class_idx]
        class_filename = os.path.join(output_dir, f"class_{class_name}.json")


        class_data = []

        for i in range(len(total_per)):
            image_name = f"img{i}.jpg"
            accuracy = total_per[i][class_idx]

            image_entry = {
                "image_name": image_name,
                "accuracy": accuracy
            }

            # print(image_name)
            # print(accuracy)

            class_data.append(image_entry)

        with open(class_filename, "w") as json_file:
            json.dump(class_data, json_file, indent=4)

    print("Individual JSON files created for each class.")

###################### ShuffleNet #############################
def generate_shuffle_net(data, truth):

    modified_data = []

    values=[]

    #replace with your own path to the dataset
    img_dir = data
    data_path = os.path.join(img_dir,'*g')
    files = glob.glob(data_path)
    data = []
    predictions=[]

    truth_file = open(truth,"r")
    true= json.loads(truth_file.read())
    class_file = open('./classes.json',"r")
    classes= json.loads(class_file.read())[0]

    #alexnet, mobilenet_v3_small shufflenet_v2_x1_0 squeezenet1_0 mnasnet0_5 squeezenet1_1

    CNN = models.shufflenet_v2_x1_0(pretrained=True)

    images=[]

    for f1 in files:
        data.append(f1)
    conv_image=[]

    transform = transforms.Compose([
            transforms.Resize(256),
            transforms.CenterCrop(224),
            transforms.ToTensor()   ,
            transforms.Normalize(
            mean = [.485, .456, .406],
            std= [.229, .224, .225])
            ])
    for i in range(len(data)):
            img=Image.open(data[i])
            img.resize((256,256))
            img = transform(img)
            images.append(torch.unsqueeze(img,0))
            CNN.eval()

    for i in range (len(images)):
        conv_image.append(CNN(images[i]))
    names=[]
    preds=[]
    total_per=[]

    # for i in range (len(conv_image)):
    for i in range(len(conv_image)):
        conv=conv_image[i]

        _, indices = torch.sort(conv, descending=True)
        percentage = torch.nn.functional.softmax(conv, dim=1)[0] # * 100
        per=[]

        name = str([(classes[idx]) for idx in indices[0][:1]])

        string = ""
        string2=""
        string+=true[i][0]
        for z in range(len(true[i])-1):
            string+=", "
            string+=true[i][z+1]

        for z in range(len(name)-4):
            string2+=name[z+2]

        names.append(string2)

        if(string==(string2)):

            predictions.append(1)
        else:
            predictions.append(0)

        strin="img"
        strin+=""+str(i)+""
        strin+=".jpg"

        print("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@")
        print(strin)

        # for idx in indices[0]:
        #     per.append(percentage[idx].item())
        # totPercent=[]
        for i in range(len(percentage)):
            per.append(percentage[i].item())
        totPercent=[]
        total_per.append(per)

        print("#########################################")
        print(per)
        print(len(per))

        entry = {
            "name": strin,
            "probabilities": per,
        }

        modified_data.append(entry)

        for l in range(len(per)):
            totPercent.append(per[l])
        values.append(totPercent)

    json_data = json.dumps(values)

    with open('shufflenet.json', 'w') as f:
        f.write(json_data)

    ans = 0
    for i in range(len(predictions)):
        if(predictions[i]==1):
            ans+=1

    print(ans)
    print(len(predictions))

    output_json_file = "Shufflenet_values_one.json"

    with open(output_json_file, "w") as json_file:
        json.dump(modified_data, json_file, indent=4)

    print(f"The modified data has been written to '{output_json_file}'.")


    # output_dir = "class_json_files"
    # os.makedirs(output_dir, exist_ok=True)
    #
    # for class_idx in range(1000):
    #     class_name = classes[class_idx]
    #     class_filename = os.path.join(output_dir, f"class_{class_name}.json")
    #
    #
    #     class_data = []
    #
    #     for i in range(len(total_per)):
    #         image_name = f"img{i}.jpg"
    #         accuracy = total_per[i][class_idx]
    #
    #         image_entry = {
    #         "image_name": image_name,
    #         "accuracy": accuracy
    #     }
    #
    #         print(image_name)
    #         print(accuracy)
    #
    #         class_data.append(image_entry)
    #
    #     with open(class_filename, "w") as json_file:
    #         json.dump(class_data, json_file, indent=4)
    #
    # print("Individual JSON files created for each class.")

##################### squeezenet1_0Net ##########################
def generate_squeeze1_0_net(data, truth):

    modified_data = []

    values=[]

    img_dir = data
    data_path = os.path.join(img_dir,'*g')
    files = glob.glob(data_path)
    data = []
    predictions=[]

    truth_file = open(truth,"r")
    true= json.loads(truth_file.read())
    class_file = open('./classes.json',"r")
    classes= json.loads(class_file.read())[0]

    #alexnet, mobilenet_v3_small shufflenet_v2_x1_0 squeezenet1_0 mnasnet0_5 squeezenet1_1

    CNN = models.squeezenet1_0(pretrained=True)

    images=[]

    for f1 in files:
        data.append(f1)
    conv_image=[]

    transform = transforms.Compose([
            transforms.Resize(256),
            transforms.CenterCrop(224),
            transforms.ToTensor()   ,
            transforms.Normalize(
            mean = [.485, .456, .406],
            std= [.229, .224, .225])
            ])
    for i in range(len(data)):
            img=Image.open(data[i])
            img.resize((256,256))
            img = transform(img)
            images.append(torch.unsqueeze(img,0))
            CNN.eval()

    for i in range (len(images)):
        conv_image.append(CNN(images[i]))

    names = []
    preds = []
    total_per = []

    # for i in range (len(conv_image)):
    for i in range(len(conv_image)):
        conv=conv_image[i]

        _, indices = torch.sort(conv, descending=True)
        percentage = torch.nn.functional.softmax(conv, dim=1)[0] # * 100
        per=[]

        name = str([(classes[idx]) for idx in indices[0][:1]])

        string = ""
        string2=""
        string+=true[i][0]
        for z in range(len(true[i])-1):
            string+=", "
            string+=true[i][z+1]

        for z in range(len(name)-4):
            string2+=name[z+2]

        if(string==(string2)):

            predictions.append(1)
        else:
            predictions.append(0)


        strin="img"
        strin+=""+str(i)+""
        strin+=".jpg"

        print("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@")
        print(strin)


        # for idx in indices[0]:
        #     per.append(percentage[idx].item())
        # totPercent=[]

        for i in range(len(percentage)):
            per.append(percentage[i].item())
        totPercent=[]
        total_per.append(per)

        entry = {
            "name": strin,
            "probabilities": per,
        }

        modified_data.append(entry)

        for l in range(len(per)):
            totPercent.append(per[l])
        values.append(totPercent)

    json_data = json.dumps(values)

    with open('squeezenet1_0.json', 'w') as f:
        f.write(json_data)

    ans = 0
    for i in range(len(predictions)):
        if(predictions[i]==1):
            ans+=1

    print(ans)
    print(len(predictions))

    output_json_file = "Squeezenet1_0_values_one.json"

    with open(output_json_file, "w") as json_file:
        json.dump(modified_data, json_file, indent=4)

    print(f"The modified data has been written to '{output_json_file}'.")


##################### squeezenet1_1Net #############################
def generate_squeeze1_1_net(data, truth):

    modified_data = []

    values=[]
    #replace with your own path to the dataset
    img_dir = data
    data_path = os.path.join(img_dir,'*g')
    files = glob.glob(data_path)
    data = []
    predictions=[]

    truth_file = open(truth,"r")
    true= json.loads(truth_file.read())
    class_file = open('./classes.json',"r")
    classes= json.loads(class_file.read())[0]

    #alexnet, mobilenet_v3_small shufflenet_v2_x1_0 squeezenet1_0 mnasnet0_5 squeezenet1_1

    CNN = models.squeezenet1_1(pretrained=True)

    images=[]

    for f1 in files:
        data.append(f1)
    conv_image=[]

    transform = transforms.Compose([
            transforms.Resize(256),
            transforms.CenterCrop(224),
            transforms.ToTensor()   ,
            transforms.Normalize(
            mean = [.485, .456, .406],
            std= [.229, .224, .225])
            ])
    for i in range(len(data)):
            img=Image.open(data[i])
            img.resize((256,256))
            img = transform(img)
            images.append(torch.unsqueeze(img,0))
            CNN.eval()

    for i in range (len(images)):
        conv_image.append(CNN(images[i]))

    names=[]
    preds=[]
    total_per=[]

    # for i in range (len(conv_image)):
    for i in range(len(conv_image)):
        conv=conv_image[i]

        _, indices = torch.sort(conv, descending=True)
        percentage = torch.nn.functional.softmax(conv, dim=1)[0]  # * 100
        per=[]

        name = str([(classes[idx]) for idx in indices[0][:1]])

        string = ""
        string2=""
        string+=true[i][0]
        for z in range(len(true[i])-1):
            string+=", "
            string+=true[i][z+1]

        for z in range(len(name)-4):
            string2+=name[z+2]

        if(string==(string2)):

            predictions.append(1)
        else:
            predictions.append(0)

        strin="img"
        strin+=""+str(i)+""
        strin+=".jpg"

        print("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@")
        print(strin)


        # for idx in indices[0]:
        #     per.append(percentage[idx].item())
        # totPercent=[]

        for i in range(len(percentage)):
            per.append(percentage[i].item())
        totPercent=[]
        total_per.append(per)

        entry = {
            "name": strin,
            "probabilities": per,
        }

        modified_data.append(entry)


        for l in range(len(per)):
            totPercent.append(per[l])
        values.append(totPercent)

    json_data = json.dumps(values)

    with open('squeezenet1_1.json', 'w') as f:
        f.write(json_data)

    ans = 0
    for i in range(len(predictions)):
        if(predictions[i]==1):
            ans+=1

    print(ans)
    print(len(predictions))

    output_json_file = "Squeezenet1_1_values_one.json"

    with open(output_json_file, "w") as json_file:
        json.dump(modified_data, json_file, indent=4)

    print(f"The modified data has been written to '{output_json_file}'.")


##################### mnasnet0_5 #############################
def generate_mnasnet0_5_net(data, truth):

    modified_data = []

    values=[]
    #replace with your own path to the dataset
    img_dir = data
    data_path = os.path.join(img_dir,'*g')
    files = glob.glob(data_path)
    data = []
    predictions=[]

    truth_file = open(truth,"r")
    true= json.loads(truth_file.read())
    class_file = open('./classes.json',"r")
    classes= json.loads(class_file.read())[0]

    #alexnet, mobilenet_v3_small shufflenet_v2_x1_0 squeezenet1_0 mnasnet0_5 squeezenet1_1

    CNN = models.mnasnet0_5(pretrained=True)

    images=[]

    for f1 in files:
        data.append(f1)
    conv_image=[]

    transform = transforms.Compose([
            transforms.Resize(256),
            transforms.CenterCrop(224),
            transforms.ToTensor()   ,
            transforms.Normalize(
            mean = [.485, .456, .406],
            std= [.229, .224, .225])
            ])
    for i in range(len(data)):
            img=Image.open(data[i])
            img.resize((256,256))
            img = transform(img)
            images.append(torch.unsqueeze(img,0))
            CNN.eval()

    for i in range (len(images)):
        conv_image.append(CNN(images[i]))

    names=[]
    preds=[]
    total_per=[]

    # for i in range (len(conv_image)):
    for i in range(len(conv_image)):
        conv=conv_image[i]

        _, indices = torch.sort(conv, descending=True)
        percentage = torch.nn.functional.softmax(conv, dim=1)[0] # * 100
        per=[]

        name = str([(classes[idx]) for idx in indices[0][:1]])

        string = ""
        string2=""
        string+=true[i][0]
        for z in range(len(true[i])-1):
            string+=", "
            string+=true[i][z+1]

        for z in range(len(name)-4):
            string2+=name[z+2]

        if(string==(string2)):

            predictions.append(1)
        else:
            predictions.append(0)

        strin="img"
        strin+=""+str(i)+""
        strin+=".jpg"

        print("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@")
        print(strin)

        # for idx in indices[0]:
        #     per.append(percentage[idx].item())
        # totPercent=[]

        for i in range(len(percentage)):
            per.append(percentage[i].item())
        totPercent=[]
        total_per.append(per)


        entry = {
            "name": strin,
            "probabilities": per,
        }

        modified_data.append(entry)

        for l in range(len(per)):
            totPercent.append(per[l])
        values.append(totPercent)

    json_data = json.dumps(values)

    with open('mnasnet.json', 'w') as f:
        f.write(json_data)

    ans = 0
    for i in range(len(predictions)):
        if(predictions[i]==1):
            ans+=1

    print(ans)
    print(len(predictions))

    output_json_file = "Mnasnet0_5_values_one.json"

    with open(output_json_file, "w") as json_file:
        json.dump(modified_data, json_file, indent=4)

    print(f"The modified data has been written to '{output_json_file}'.")


@app.route('/')
def index():
    print(fetch_alex())

    return render_template('index.html')
@app.route('/runAlex')
def run_alex():
    data_folder = request.args.get('data' , type=str)
    truth_file = request.args.get('truth' , type=str)
    # data_folder = './dataset'
    # truth_file = './truth.json'

    generate_alex_net(data_folder, truth_file)

    return jsonify({"message": "AlexNet generation initiated"})

@app.route('/runMobile')
def run_mobile():
    data_folder = request.args.get('data', type=str)
    truth_file = request.args.get('truth', type=str)
    # data_folder = './dataset'
    # truth_file = './truth.json'

    generate_mobile_net(data_folder, truth_file)

    return jsonify({"message": "MobileNet generation initiated"})

@app.route('/runShuffle')
def run_shuffle():
    data_folder = request.args.get('data', type=str)
    truth_file = request.args.get('truth', type=str)
    # data_folder = './dataset'
    # truth_file = './truth.json'

    generate_shuffle_net(data_folder, truth_file)

    return jsonify({"message": "ShuffleNet generation initiated"})

@app.route('/runSqueezenet1_0')
def run_squeezenet1_0():
    data_folder = request.args.get('data', type=str)
    truth_file = request.args.get('truth', type=str)
    # data_folder = './dataset'
    # truth_file = './truth.json'

    generate_squeeze1_0_net(data_folder, truth_file)

    return jsonify({"message": "ShuffleNet generation initiated"})


@app.route('/runSqueezenet1_1')
def run_squeezenet1_1():
    data_folder = request.args.get('data', type=str)
    truth_file = request.args.get('truth', type=str)
    # data_folder = './dataset'
    # truth_file = './truth.json'

    generate_squeeze1_1_net(data_folder, truth_file)

    return jsonify({"message": "ShuffleNet generation initiated"})


@app.route('/runMnasnet0_5')
def run_Mnasnet0_5():
    data_folder = request.args.get('data', type=str)
    truth_file = request.args.get('truth', type=str)
    # data_folder = './dataset'
    # truth_file = './truth.json'

    generate_mnasnet0_5_net(data_folder, truth_file)

    return jsonify({"message": "ShuffleNet generation initiated"})


@app.route('/fetchAlex')
def fetch_alex():
    model = request.args.get('model', default='alexnet', type=str)
    # filename = "Alex_Net_values.json"
    # filename = './image_json_files_alex/img7.json'
    filename = "Alexnet_values_one.json"
    # filename = "truth.json"

    try:
        with open(filename, 'r') as json_file:
            data = json.load(json_file)
        return jsonify(data)
    except FileNotFoundError:

        return jsonify({"error": "File not found"}), 404

@app.route('/fetchMobile')
def fetch_mobile():
    model = request.args.get('model', default='mobilenet', type=str)
    # filename = "Mobile_Net_values.json"
    #filename = './image_json_files_mobile/img7.json'
    filename = "Mobilenet_values_one.json"

    try:
        with open(filename, 'r') as json_file:
            data = json.load(json_file)
        return jsonify(data)
    except FileNotFoundError:
        return jsonify({"error": "File not found"}), 404

@app.route('/fetchShuffle')
def fetch_shuffle():
    model = request.args.get('model', default='shufflenet', type=str)
    # filename = "Mobile_Net_values.json"
    #filename = './image_json_files_mobile/img7.json'
    filename = "Shufflenet_values_one.json"

    try:
        with open(filename, 'r') as json_file:
            data = json.load(json_file)
        return jsonify(data)
    except FileNotFoundError:
        return jsonify({"error": "File not found"}), 404

@app.route('/fetchSqueezenet1_0')
def fetch_squeezenet1_0():
    model = request.args.get('model', default='squeezenet1_0', type=str)
    # filename = "Mobile_Net_values.json"
    #filename = './image_json_files_mobile/img7.json'
    filename = "Squeezenet1_0_values_one.json"

    try:
        with open(filename, 'r') as json_file:
            data = json.load(json_file)
        return jsonify(data)
    except FileNotFoundError:
        return jsonify({"error": "File not found"}), 404


@app.route('/fetchSqueezenet1_1')
def fetch_squeezenet1_1():
    model = request.args.get('model', default='squeezenet1_1', type=str)
    # filename = "Mobile_Net_values.json"
    #filename = './image_json_files_mobile/img7.json'
    filename = "Squeezenet1_1_values_one.json"

    try:
        with open(filename, 'r') as json_file:
            data = json.load(json_file)
        return jsonify(data)
    except FileNotFoundError:
        return jsonify({"error": "File not found"}), 404


@app.route('/fetchMnasnet0_5')
def fetch_mnasnet0_5():
    model = request.args.get('model', default='mnasnet0_5', type=str)
    # filename = "Mobile_Net_values.json"
    #filename = './image_json_files_mobile/img7.json'
    filename = "Mnasnet0_5_values_one.json"

    try:
        with open(filename, 'r') as json_file:
            data = json.load(json_file)
        return jsonify(data)
    except FileNotFoundError:
        return jsonify({"error": "File not found"}), 404

@app.route('/api/classes')
def get_classes():
    try:
        with open('classes.json', 'r') as f:
            class_data = json.load(f)
        return jsonify(class_data)
    except FileNotFoundError:
        return jsonify({"error": "Class data not found"}), 404


if __name__ == '__main__':
    app.run(debug=True)
