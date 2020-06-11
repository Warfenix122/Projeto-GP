export class Project {
    _id: string;
    nome: string;
    resumo: string;
    responsavelId: string; //mongoose.ObjectId
    // categorias: [{ categoriaId: string }]; //mongoose.ObjectId
    palavrasChave: [{ nome: string }];
    contactos: [{ contacto: string, descricao: string }];
    publicoAlvoId: string; //mongoose.ObjectId
    formacoesNecessarias: [string];
    XemXTempo: string; // "1 vez por mes " etc..
    aprovado: { type: string }; //enum: ["Recusado", "Em Espera", "Aprovado"]
    gestores: [{ gestorId: string }]; //só podem ser externos //mongoose.ObjectId
    comentarios: [
        {
        comentario: string,
        utilizadorId: string, //mongoose.ObjectId
        dataCriacao: Date,
        },
    ];
    vagas: number;
    atividades: [{ descricao: string, dataAcontecimento: Date }];
    ficheirosCaminho: [{ caminho: string }];
    projetoMes: boolean;
    dataCriacao: Date;
    dataTermino: Date;
    dataFechoInscricoes: Date;
    dataComeco: Date;
    areasInteresse: [string];
}