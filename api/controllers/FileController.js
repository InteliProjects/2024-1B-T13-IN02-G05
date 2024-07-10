/**
 * FileController
 *
 * @description :: Controller utilizado para criar, buscar, e deletar arquivos no Model File. 
 */

module.exports = {
  
    //metodo que cria um novo file
    create: async function (req, res) {
        try {
            // Validação de campos obrigatórios
            const { manuals_id, names, types, url } = req.body;
            if (!manuals_id || !names || !types || !url) {
                return res.status(400).json({ error: "Missing required fields" });
            }    
            // Criando novo arquivo
            const fil = await File.create(req.body).fetch();
            console.log("Arquivo criado com sucesso:", fil);
    
            // Feedback para o usuário
            return res.json({ message: "File created successfully!", file: fil });
        } catch (err) {
            // Erros gerais
            console.error("Erro durante a criação do arquivo:", err);
            return res.status(500).json({ error: "Internal server error", requisicao: req.body });
        }
    },
    
    //metodo que faz select * em file
    getAll: async function (req, res) {
        try {
            //fazendo select * em file
            const files = await File.find()
            
            //retornando o select
            return res.json(files);
        } catch (err) {
            //erros gerais
            return res.serverError(err);
        }
    },

    //metodo que faz select * em file where manuals_id == 1
    getByManual: async function (req, res) {
        try {
            //fazendo select * em file
            const files = await File.find({ manuals_id: req.params.manualId})
            
            //retornando o select
            return res.json(files);
        } catch (err) {
            //erros gerais
            
            return res.serverError(err);
        }
    },

    //metodo que deleta o registro de um delegation
    delete:  async function (req, res) {
        try {
            //pegando o id requisitado
            const fileId = req.params.id;
            
            //deletando o registro
            const deletedFile = await File.destroyOne({ id: fileId });

            return res.json({message: "File deleted sucessfully"})
        } catch (err) {
            //erros gerais
            return res.serverError(err);
        }
    }
};
