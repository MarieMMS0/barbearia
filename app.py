from flask import Flask, render_template, request, redirect
import urllib.parse

from flask_sqlalchemy import SQLAlchemy
from datetime import date

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
db = SQLAlchemy(app)

class Agendamento(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(100))
    telefone = db.Column(db.String(15))
    barbeiro = db.Column(db.String(50))
    data = db.Column(db.String(10))
    hora = db.Column(db.String(5))
    servico = db.Column(db.String(50))

# Rota da página inicial
@app.route('/')
def index():
    return render_template('index.html')

# Rota da página de serviços
@app.route('/servicos')
def servicos():
    return render_template('servicos.html')

# Rota da página de agendamento
@app.route('/agendamento', methods=['GET', 'POST'])
def agendamento():
    if request.method == 'POST':
        nome = request.form.get('nome')
        telefone = request.form.get('telefone')
        barbeiro = request.form.get('barbeiro')
        data_agendada = request.form.get('data')
        hora = request.form.get('hora')
        servico = request.form.get('servico')

        # Salvar no banco
        novo_agendamento = Agendamento(
            nome=nome,
            telefone=telefone,
            barbeiro=barbeiro,
            data=data_agendada,
            hora=hora,
            servico=servico
        )
        db.session.add(novo_agendamento)
        db.session.commit()

        # Redirecionar pro WhatsApp
        mensagem = f"Olá! Gostaria de agendar um horário na barbearia Oliver's.\n\nNome: {nome}\nWhatsApp: {telefone}\nBarbeiro: {barbeiro}\nData: {data_agendada}\nHora: {hora}\nServiço: {servico}"
        mensagem_encoded = urllib.parse.quote(mensagem)
        link_whatsapp = f"https://wa.me/5541991427664?text={mensagem_encoded}"
        return redirect(link_whatsapp)

    return render_template('agendamento.html')

# Rota da página de contato
@app.route('/contato', methods=['GET', 'POST'])
def contato():
    if request.method == 'POST':
        nome = request.form.get('nome')
        mensagem = request.form.get('mensagem')

        texto_whatsapp = f"Olá! Meu nome é {nome} e gostaria de falar o seguinte:\n\n{mensagem}"
        mensagem_encoded = urllib.parse.quote(texto_whatsapp)

        link_whatsapp = f"https://wa.me/5541991427664?text={mensagem_encoded}"
        return redirect(link_whatsapp)

    return render_template('contato.html')

# Rota da área administrativa
@app.route('/admin')
def admin():
    agendamentos = Agendamento.query.all()
    return render_template('admin.html', agendamentos=agendamentos)

# Criar banco antes de rodar o app
with app.app_context():
    db.create_all()

# Rodar o app
if __name__ == '__main__':
    app.run(debug=True)
