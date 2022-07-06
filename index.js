const express = require('express')
const cors = require('cors')

const { pool } = require('./config')

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

const getPredios = (request, response) => {
    pool.query('SELECT * FROM predios ORDER BY codigo',
        (error, results) => {
            if (error) {
                return response.status(400).json(
                    {
                        status: 'error',
                        message: 'Erro ao consultar a tabela predios: ' + error
                    }
                )
            }
            response.status(200).json(results.rows);
        }
    )
}

const addPredio = (request, response) => {
    const { nome, descricao, sigla } = request.body;
    pool.query(`INSERT INTO predios (nome, descricao, sigla) 
    VALUES ($1, $2 , $3)
    RETURNING codigo, nome, descricao, sigla`,
        [nome, descricao, sigla],
        (error, results) => {
            if (error) {
                return response.status(400).json(
                    {
                        status: 'error',
                        message: 'Erro ao inserir o predio: ' + error
                    }
                )
            }
            response.status(200).json(
                {
                    status: 'success', message: 'Prédio criado',
                    objeto: results.rows[0]
                }
            );
        }
    )
}

const updatePredio = (request, response) => {
    const { codigo, nome, descricao, sigla } = request.body;
    pool.query(`UPDATE PREDIOS SET nome=$1, 
    descricao=$2, sigla=$3
    WHERE codigo = $4
    RETURNING codigo, nome, descricao, sigla`,
        [nome, descricao, sigla, codigo],
        (error, results) => {
            if (error) {
                return response.status(400).json(
                    {
                        status: 'error',
                        message: 'Erro ao atualizar o predio: ' + error
                    }
                )
            }
            response.status(200).json(
                {
                    status: 'success', message: 'Prédio atualizado',
                    objeto: results.rows[0]
                }
            );
        }
    )
}

const deletePredio = (request, response) => {
    const codigo = parseInt(request.params.codigo);
    pool.query(`DELETE FROM predios where codigo = $1`,
        [codigo],
        (error, results) => {
            if (error || results.rowCount == 0) {
                return response.status(400).json(
                    {
                        status: 'error',
                        message: 'Erro ao remover o predio: ' + error
                    }
                )
            }
            response.status(200).json(
                {
                    status: 'success', message: 'Prédio removido'
                }
            );
        }
    )
}

const getPredioPorCodigo = (request, response) => {
    const codigo = parseInt(request.params.codigo);
    pool.query(`SELECT * FROM predios where codigo = $1`,
        [codigo],
        (error, results) => {
            if (error || results.rowCount == 0) {
                return response.status(400).json(
                    {
                        status: 'error',
                        message: 'Erro ao recuperar o predio: ' + error
                    }
                )
            }
            response.status(200).json(results.rows[0]);
        }
    )
}

const getSalas = (request, response) => {
    pool.query(`select s.codigo as codigo, s.numero as numero, 
    s.descricao as descricao, 
    s.capacidade as capacidade, 
    s.predio as predio, p.nome as nomepredio
    from salas s
    join predios p on s.predio = p.codigo
    order by s.codigo`,
        (error, results) => {
            if (error) {
                return response.status(400).json(
                    {
                        status: 'error',
                        message: 'Erro ao consultar a tabela salas: ' + error
                    }
                )
            }
            response.status(200).json(results.rows);
        }
    )
}

const addSala = (request, response) => {
    const { numero, descricao, capacidade, predio } = request.body;
    pool.query(`insert into salas (numero, descricao, capacidade, predio) 
    values ($1, $2, $3, $4)
    returning codigo, numero, descricao, capacidade, predio`,
        [numero, descricao, capacidade, predio],
        (error, results) => {
            if (error) {
                return response.status(400).json(
                    {
                        status: 'error',
                        message: 'Erro ao inserir a sala: ' + error
                    }
                )
            }
            response.status(200).json(
                {
                    status: 'success', message: 'Sala criada',
                    objeto: results.rows[0]
                }
            );
        }
    )
}

const updateSala = (request, response) => {
    const { codigo, numero, descricao, capacidade, predio } = request.body;
    pool.query(`UPDATE salas
	SET numero=$1, descricao=$2, capacidade=$3, predio=$4
	WHERE codigo=$5
    returning codigo, numero, descricao, capacidade, predio`,
        [numero, descricao, capacidade, predio, codigo],
        (error, results) => {
            if (error) {
                return response.status(400).json(
                    {
                        status: 'error',
                        message: 'Erro ao atualizar a sala: ' + error
                    }
                )
            }
            response.status(200).json(
                {
                    status: 'success', message: 'Sala atualizada',
                    objeto: results.rows[0]
                }
            );
        }
    )
}

const deleteSala = (request, response) => {
    const codigo = parseInt(request.params.codigo);
    pool.query(`DELETE FROM salas where codigo = $1`,
        [codigo],
        (error, results) => {
            if (error || results.rowCount == 0) {
                return response.status(400).json(
                    {
                        status: 'error',
                        message: 'Erro ao remover a sala: ' + error
                    }
                )
            }
            response.status(200).json(
                {
                    status: 'success', message: 'Sala removida'
                }
            );
        }
    )
}

const getSalaPorCodigo = (request, response) => {
    const codigo = parseInt(request.params.codigo);
    pool.query(`select s.codigo as codigo, s.numero as numero, 
    s.descricao as descricao, 
    s.capacidade as capacidade, 
    s.predio as predio, p.nome as nomepredio
    from salas s
    join predios p on s.predio = p.codigo
    where s.codigo = $1`,
        [codigo],
        (error, results) => {
            if (error || results.rowCount == 0) {
                return response.status(400).json(
                    {
                        status: 'error',
                        message: 'Erro ao recuperar a sala: ' + error
                    }
                )
            }
            response.status(200).json(results.rows[0]);
        }
    )
}

app.route('/predios')
    .get(getPredios)
    .post(addPredio)
    .put(updatePredio)

app.route('/predios/:codigo')
    .delete(deletePredio)
    .get(getPredioPorCodigo)

app.route('/salas')
    .get(getSalas)
    .post(addSala)
    .put(updateSala)

app.route('/salas/:codigo')
    .delete(deleteSala)
    .get(getSalaPorCodigo)    

app.listen(process.env.PORT || 3002, () => {
    console.log('Servidor da API rodando')
})

