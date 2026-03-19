import csv
import os, glob

file_path = glob.glob('*.tsv')[0]

with open(file_path, mode='r', encoding='utf-8') as f:
        reader = csv.reader(f, delimiter='\t')
        header = next(reader)
        for row in reader:
            date = row[0]
            name = row[2] # host in tsv
            title = row[3] # event in tsv
            session = row[4]
            role = row[6] # roles in tsv

            print(f"""  - title: "{title}"
    name: "{name}"
    session: "{session}"
    role: "{role}"
    date: {date[:7]}""")
