from datetime import datetime
from flask import jsonify, make_response, abort

def get_timestamp():
    return datetime.now().strftime(("%Y-%m-%d %H:%M:%S"))

PROMOCOES = {
    "Dipirona Gotas 91% de desconto": {
        "farmacia": "Onofre",
        "medicamento": "Dipirona Gotas 20ml",
        "descricao": "Dipirona Gotas 91% de desconto",   
        "link": "https://bit.ly/2IxRCrc",
        "dataInicio": get_timestamp(),
    },
    "Uniprazol 23% de desconto. Nao Perca": {
        "farmacia": "Onofre",
        "medicamento": "Uniprazol 20mg Com 28 Capsulas",
        "descricao": "Uniprazol 23% de desconto. Nao Perca!!",   
        "link": "https://bit.ly/2GI7e9z",
        "dataInicio": get_timestamp(),
    },
    "Merthiolate 15% de desconto": {
        "farmacia": "Onofre",
        "medicamento": "Merthiolate Incolor 30ml",
        "descricao": "Merthiolate 15% de desconto",   
        "link": "https://bit.ly/2SpppCk",
        "dataInicio": get_timestamp(),
    },
}

def read_all():
    dict_promocoes = [PROMOCOES[key] for key in sorted(PROMOCOES.keys())]
    promocoes = jsonify(dict_promocoes)
    qtd = len(dict_promocoes)
    content_range = "promocoes 0-"+str(qtd)+"/"+str(qtd)
    # Configura headers
    promocoes.headers['Access-Control-Allow-Origin'] = '*'
    promocoes.headers['Access-Control-Expose-Headers'] = 'Content-Range'
    promocoes.headers['Content-Range'] = content_range
    return promocoes

def read_one(descricao):
    if descricao in PROMOCOES:
        promocao = PROMOCOES.get(descricao)
    else:
        abort(
            404, "Promocao com esta descricao {descricao} nao encontrada".format(descricao=descricao)
        )
    return promocao


def create(promocao):
    farmacia = promocao.get("farmacia", None)
    medicamento = promocao.get("medicamento", None)
    descricao = promocao.get("descricao", None)
    link = promocao.get("link", None)

    if descricao not in PROMOCOES and descricao is not None:
        PROMOCOES[descricao] = {
            "farmacia": farmacia,
            "medicamento": medicamento,
            "descricao": descricao,
            "link": link,
            "dataInicio": get_timestamp(),
        }
        return make_response(
            "{descricao} criada com sucesso".format(descricao=descricao), 201
        )
    else:
        abort(
            406,
            "Promocao com esta descricao {descricao} ja existe".format(descricao=descricao),
        )


def update(descricao, promocao):
    if descricao in PROMOCOES:
        PROMOCOES[descricao]["farmacia"] = promocao.get("farmacia")
        PROMOCOES[descricao]["medicamento"] = promocao.get("medicamento")
        PROMOCOES[descricao]["link"] = promocao.get("link")
        PROMOCOES[descricao]["dataInicio"] = get_timestamp()

        return PROMOCOES[descricao]
    else:
        abort(
            404, "Promocao com a descricao {descricao} nao foi encontrada".format(descricao=descricao)
        )

def delete(descricao):
    if descricao in PROMOCOES:
        del PROMOCOES[descricao]
        return make_response(
            "{descricao} excluida com sucesso".format(descricao=descricao), 200
        )
    else:
        abort(
            404, "Promocao com a descricao {descricao} nao foi encontrada".format(descricao=descricao)
        )

