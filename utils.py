import matplotlib.pyplot as plt
import mpld3

from config import ALLOWED_EXTENSIONS


def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


def get_plot(fpath):
    tags, vals = [], []
    with open(fpath, encoding="cp1251") as f:
        for line in f:
            if not line.startswith(("#", " ", "\n", "\t")):
                tag, val = line.strip().split(" ")
                tags.append(float(tag))
                vals.append(float(val))
    plt.scatter(tags, vals, s=1)
    plt.title("Plot: {}".format(fpath.split("/")[-1]))
    plt.xlabel("Tag")
    plt.ylabel("Value", labelpad=8)

    plt_dict = mpld3.fig_to_dict(plt.gcf())
    plt.clf()
    return plt_dict
