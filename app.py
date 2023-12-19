import json
from flask import Flask, render_template, jsonify, request, session, redirect, url_for
from bson import ObjectId
from pymongo import MongoClient
import jwt
from datetime import datetime, timedelta
import hashlib

app = Flask(__name__)
app.secret_key = 'MACKLINIK'
client = MongoClient('mongodb+srv://mryhan:mryhan@cluster0.cq5ursx.mongodb.net/?retryWrites=true&w=majority&appName=AtlasApp')
db = client.macklinik

SECRET_KEY = 'MACKLINIK'
TOKEN = 'ryhan'

# user
@app.route('/', methods=['GET'])
def home():
    token_receive = session.get('token')
    try:
        payload = jwt.decode(
            token_receive,
            SECRET_KEY,
            algorithms=['HS256']
        )
        user_info = db.user.find_one({"username": payload["username"]})
        return render_template('user/index.html', user_info=user_info)
    except jwt.ExpiredSignatureError:
        return redirect(url_for('login_user', msg='Token login Anda telah kedaluwarsa'))
    except jwt.exceptions.DecodeError:
        return redirect(url_for('login_user', msg='Ada masalah saat Anda login'))
    
@app.route('/get_artikel')
def get_artikel():
    json_path = 'static/user/data_artikel.json'

    try:
        with open(json_path, 'r') as json_file:
            artikel_data = json.load(json_file)

        artikel_list = [
            {
                'id': artikel['id'],
                'image': artikel['image'],
                'title': artikel['title'],
                'description': artikel['description'],
                'link': artikel['link'],
            }
            for artikel in artikel_data['articles']
        ]

        return jsonify({'artikel_data': artikel_list})

    except FileNotFoundError:
        return jsonify({'error': 'File not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@app.route('/get_artikel/index_artikel', methods=['GET'])
def index_artikel():
    msg = request.args.get('msg')
    return render_template('user/data_artikel.html', msg=msg)

@app.route('/login_user', methods=['GET'])
def login_user():
    msg = request.args.get('msg')
    return render_template('user/login_user.html', msg=msg)

@app.route('/regis_user', methods=['GET'])
def regis_user():
    msg = request.args.get('msg')
    return render_template('user/regis_user.html', msg=msg)

@app.route('/api/regis_user', methods=['POST'])
def api_regis_user():
    un_receive = request.form.get('un_give')
    pw_receive = request.form.get('pw_give')
    confirm_pw_receive = request.form.get('confirm_pw_give')

    pw_hash = hashlib.sha256(pw_receive.encode('utf-8')).hexdigest()
    konfirm_pw_hash = hashlib.sha256(confirm_pw_receive.encode('utf-8')).hexdigest()
    existing_user = bool(db.user.find_one({"username": un_receive}))
    
    if existing_user:
        error_msg = f"Username '{un_receive}' has been used!"
        return jsonify({'result': 'fail', 'msg': error_msg})
    
    if pw_hash != konfirm_pw_hash:
        return jsonify({'result': 'sament'})
    
    db.user.insert_one({'username': un_receive, 'password': pw_hash, 'confirm_password': konfirm_pw_hash})
    return jsonify({'result': 'success', 'msg': 'Registration successful'})

@app.route('/api/login_user', methods=['POST'])
def api_login_user():
    un_receive = request.form.get('un_give')
    pw_receive = request.form.get('pw_give')
    pw_hash = hashlib.sha256(pw_receive.encode('utf-8')).hexdigest()
    result = db.user.find_one({'username': un_receive, 'password': pw_hash})

    if result:
        payload = {
            'username': un_receive,
            'exp': datetime.utcnow() + timedelta(seconds=60 * 60 * 24),
        }
        token = jwt.encode(payload, SECRET_KEY, algorithm='HS256')
        
        # Simpan token di session untuk dapat diakses di rute home
        session['token'] = token

        return redirect(url_for('home'))
    else:
        return jsonify({"result": 'fail', 'msg': 'Incorrect username or password, please try again'})
    
@app.route('/checkLoginStatus', methods=['GET'])
def check_login_status():
    token_receive = session.get('token')
    try:
        jwt.decode(token_receive, SECRET_KEY, algorithms=['HS256'])
        return jsonify({'isLoggedIn': True})
    except jwt.ExpiredSignatureError:
        return jsonify({'isLoggedIn': False, 'msg': 'Token login Anda telah kedaluwarsa'})
    except jwt.exceptions.DecodeError:
        return jsonify({'isLoggedIn': False, 'msg': 'Ada masalah saat Anda login'})
    
@app.route('/obat', methods=['GET'])
def obat():
    msg = request.args.get('msg')
    return render_template('user/daftar_obat.html', msg=msg)

@app.route('/product_obat', methods=['GET'])
def product_obat():
    msg = request.args.get('msg')
    return render_template('user/product.html', msg=msg)

@app.route('/obat/checkout', methods=['GET'])
def checkout():
    msg = request.args.get('msg')
    return render_template('user/checkout.html', msg=msg)

@app.route('/keluhan', methods=['GET'])
def keluhan():
    msg = request.args.get('msg')
    return render_template('user/keluhan.html', msg=msg)

@app.route('/keluhan/save', methods=['POST'])
def keluhan_save():
    fullname_receive = request.form.get('fullname_give')
    age_receive = request.form.get('age_give')
    phone_receive = request.form.get('phone_give')
    date_receive = request.form.get('date_give')
    gender_receive = request.form.get('radio_give')
    address_receive = request.form.get('address_give')
    keluhan_receive = request.form.get('keluhan_give')

    db.keluhan.insert_one({'Fullname': fullname_receive, 'Age': age_receive, 'Phone': phone_receive, 'Date': date_receive, 'Gender': gender_receive, 'Address': address_receive, 'Keluhan': keluhan_receive})
    msg = ("Data berhasil disimpan!")
    return redirect(url_for('keluhan', msg=msg))

@app.route('/artikel', methods=['GET'])
def artikel():
    msg = request.args.get('msg')
    return render_template('user/artikel.html', msg=msg)

@app.route('/artikel/read', methods=['GET'])
def read_artikel():
    
    json_path = 'static/user/data_artikel.json'

    try:
        with open(json_path, 'r') as json_file:
            artikel_data = json.load(json_file)
    except FileNotFoundError:
        artikel_data = []

    return jsonify(articles=artikel_data)

@app.route('/artikel/show', methods=['GET'])
def show_artikel():
    msg = request.args.get('msg')
    return render_template('user/data_artikel.html', msg=msg)

@app.route('/hist_pembelian', methods=['GET'])
def hist_pembelian():
    msg = request.args.get('msg')
    return render_template('user/hist_pembelian.html', msg=msg)

@app.route('/hist_keluhan', methods=['GET'])
def hist_keluhan():
    msg = request.args.get('msg')
    return render_template('user/hist_keluhan.html', msg=msg)

@app.route('/hist_keluhan/list_keluhan', methods=['GET'])
def list_keluhan():
    keluhan_data = db.keluhan.find({}, {'_id': False})

    keluhan_list = [
        {
            'fullname': keluhan['Fullname'],
            'date': (
                datetime.strptime(keluhan['Date'], '%Y-%m-%d')
                if isinstance(keluhan['Date'], str)
                else keluhan['Date']
            ).strftime('%Y-%m-%d')
        }
        for keluhan in keluhan_data
    ]

    return jsonify({'keluhan_data': keluhan_list})

@app.route('/profil', methods=['GET'])
def profil():
    msg = request.args.get('msg')
    return render_template('user/profil.html', msg=msg)



# admin
@app.route('/admin', methods=['GET'])
def admin():
    token_receive = session.get('token')
    try:
        payload = jwt.decode(
            token_receive,
            SECRET_KEY,
            algorithms=['HS256']
        )
        user_info = db.admin.find_one({"username": payload["username"]})
        return render_template('admin/adm_dashboard.html', user_info=user_info)
    except jwt.ExpiredSignatureError:
        return redirect(url_for('login_user', msg='Token login Anda telah kedaluwarsa'))
    except jwt.exceptions.DecodeError:
        return redirect(url_for('login_user', msg='Ada masalah saat Anda login'))

@app.route('/login_admin')
def login_admin():
    msg = request.args.get('msg')
    return render_template('admin/login_admin.html', msg=msg)

@app.route('/regis_admin')
def regis_admin():
    msg = request.args.get('msg')
    return render_template('admin/regis_admin.html', msg=msg)

@app.route('/api/regis_admin', methods=['POST'])
def api_regis_admin():
    un_receive = request.form.get('un_give')
    pw_receive = request.form.get('pw_give')
    confirm_pw_receive = request.form.get('confirm_pw_give')

    pw_hash = hashlib.sha256(pw_receive.encode('utf-8')).hexdigest()
    konfir_pw_hash = hashlib.sha256(confirm_pw_receive.encode('utf-8')).hexdigest()
    existing_user = bool(db.admin.find_one({"username": un_receive}))
    
    if existing_user:
        error_msg = f"Username '{un_receive}' has been used!"
        return jsonify({'result': 'fail', 'msg': error_msg})
    
    if pw_hash != konfir_pw_hash:
        return jsonify({'result': 'sament'})
    
    db.admin.insert_one({'username': un_receive, 'password': pw_hash, 'confirm_password': konfir_pw_hash})
    return jsonify({'result': 'success', 'msg': 'Registration successful'})

@app.route('/api/login_admin', methods=['POST'])
def api_login_admin():
    un_receive = request.form.get('un_give')
    pw_receive = request.form.get('pw_give')
    pw_hash = hashlib.sha256(pw_receive.encode('utf-8')).hexdigest()
    result = db.admin.find_one({'username': un_receive, 'password': pw_hash})

    if result:
        payload = {
            'username': un_receive,
            'exp': datetime.utcnow() + timedelta(seconds=60 * 60 * 24),
        }
        token = jwt.encode(payload, SECRET_KEY, algorithm='HS256')
        
        # Simpan token di session untuk dapat diakses di rute home
        session['token'] = token

        return redirect(url_for('home'))
    else:
        return jsonify({"result": 'fail', 'msg': 'Incorrect username or password, please try again'})
    
@app.route('/adm_dashboard', methods=['GET'])
def adm_dashboard():
    msg = request.args.get('msg')
    return render_template('admin/adm_dashboard.html', msg=msg)

@app.route('/adm_obat', methods=['GET'])
def adm_obat():
    msg = request.args.get('msg')
    return render_template('admin/adm_pembelian_obat.html', msg=msg)

@app.route('/adm_keluhan', methods=['GET'])
def adm_keluhan():
    msg = request.args.get('msg')
    return render_template('admin/adm_keluhan_pasien.html', msg=msg)

@app.route('/adm_keluhan/get_show', methods=['GET'])
def get_show():
    keluhan_data = db.keluhan.find({}, {'_id': False})

    keluhan_list = [
        {
            'fullname': keluhan['Fullname'],
            'date': (
                datetime.strptime(keluhan['Date'], '%Y-%m-%d')
                if isinstance(keluhan['Date'], str)
                else keluhan['Date']
            ).strftime('%Y-%m-%d')
        }
        for keluhan in keluhan_data
    ]

    return jsonify({'keluhan_data': keluhan_list})

@app.route('/adm_keluhan/get_lihat', methods=['GET'])
def get_lihat():
    id = request.args.get("id")
    try:
        detail = db.keluhan.find_one({'_id': ObjectId(id)})
        if detail:
            detail['_id'] = str(detail['_id'])
            detail.pop('Gender', None)
            return jsonify({"detail": detail})
        else:
            return jsonify({"error": "No document found with the given ID"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/adm_keluhan/update_keluhan', methods=['POST'])
def update_keluhan():
    keluhan_result = db.keluhan.find({}, {'_id': False})
    keluhan = []
    for keluhan in keluhan_result:
        definition = keluhan['Fullname'][0]['shortdef']
        definition = definition if type(definition) is str else definition[0]
        keluhan.append({
            'word': keluhan['word'],
            'definition': definition,
        })
    msg = request.args.get('msg')
    return render_template('admin/adm_keluhan_pasien.html',keluhan=keluhan, msg=msg)

@app.route("/adm_keluhan/delete_keluhan", methods=["POST"])
def delete_keluhan():
    try:
        fullname_receive = request.form["fullname_give"]
        db.keluhan.delete_one({'Fullname': fullname_receive})
        return jsonify({'msg': 'Data berhasil dihapus'})
    except Exception as e:
        print("Error:", str(e))
        return jsonify({'error': str(e)}), 400

@app.route('/adm_artikel', methods=['GET'])
def adm_artikel():
    msg = request.args.get('msg')
    return render_template('admin/adm_artikel.html', msg=msg)

@app.route('/adm_hist_regis', methods=['GET'])
def adm_hist_regis():
    msg = request.args.get('msg')
    return render_template('admin/hist_regis_admin.html', msg=msg)

@app.route('/adm_hist_regis/list_regis', methods=['GET'])
def list_regis():    
    regis_data = db.user.find({}, {'_id': False})
    regis_list = [{'username': user['username']} for user in regis_data]
    return jsonify({'usernames': regis_list})

@app.route("/adm_hist_regis/delete_list_regis", methods=["POST"])
def delete_list_regis():
    try:
        username_receive = request.form["username_give"]
        db.user.delete_one({'username': username_receive}) 
        return jsonify({'msg': 'Data berhasil dihapus'})
    except Exception as e:
        print("Error:", str(e))
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run('0.0.0.0', port=8000, debug=True)
