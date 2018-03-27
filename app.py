import json
import os
from urllib.parse import unquote
from mpld3._display import NumpyEncoder
from werkzeug.utils import secure_filename
from werkzeug.exceptions import BadRequest

from flask import (
    flash,
    Flask,
    jsonify,
    make_response,
    redirect,
    request,
    render_template,
    session,
    url_for
)
from flask.views import MethodView

import config
from utils import allowed_file, get_plot


app = Flask(
    __name__,
    static_folder="static/dist",
    template_folder="static")

app.config['SESSION_TYPE'] = config.SESSION_TYPE
app.config['SECRET_KEY'] = config.SECRET_KEY
app.config['UPLOAD_FOLDER'] = config.UPLOAD_FOLDER


# basic views
@app.errorhandler(400)
def err_400(error):
    return make_response(
        jsonify({'error': 'Bad Request'}), 400)


@app.errorhandler(404)
def err_404(error):
    return make_response(
        jsonify({'error': 'Not Found'}), 404)


@app.route("/")
def index():
    path_list = [
        os.path.join(r, file)
        for r, d, f in os.walk(app.config["UPLOAD_FOLDER"])
        for file in f
    ]
    return render_template("index.html", path_list=path_list)


class FileAPI(MethodView):
    def get(self):
        path = request.args.get('path')
        print(path)
        try:
            plt = get_plot(path)
        except TypeError as e:
            return jsonify("", 204)
        return json.dumps(plt, cls=NumpyEncoder)

    def post(self):
        if 'file' not in request.files:
            flash('No file part')
            return redirect(request.url)

        file = request.files['file']

        if file.filename == '':
            flash('No selected file')
            return redirect(request.url)

        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file.save(os.path.join(app.config["UPLOAD_FOLDER"], filename))
            return redirect(url_for("files", filename=filename))
        raise BadRequest

    def delete(self, fpath):
        os.remove(fpath)
        return jsonify({"success": True}, 200)


file_view = FileAPI.as_view('file_api')
app.add_url_rule(
    "/api/files/",
    view_func=file_view,
    methods=["GET", "POST"]
)
app.add_url_rule(
    "/api/files/<path:fpath>",
    view_func=file_view,
    methods=['DELETE',]
)


if __name__ == '__main__':
    session.init_app(app)
    app.run()
