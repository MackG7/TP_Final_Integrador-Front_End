const messenger_data = {
    contacts: [
        {
            id: 1,
            name: 'Neo',
            last_seen: "hoy a las 14:19",
            last_time_connected: '14:19',
            img: "https://upload.wikimedia.org/wikipedia/en/c/c6/NeoTheMatrix.jpg",
            last_message: {
                id: 1,
                text: 'Entonces seguiría eligiendo. Porque al final, eso es lo único que nos hace libres.'
            },
            unread_messages: 1,
            messages: [
                {
                    emisor: 'YO',
                    hora: '23:10',
                    id: 1,
                    texto: 'Neo, ¿cómo sabes que eres realmente el Elegido?',
                    status: 'visto'
                },
                {
                    emisor: 'USUARIO',
                    hora: '23:11',
                    id: 2,
                    texto: 'No se trata de creer que lo soy. Se trata de saber que la elección existe… incluso cuando otros dicen que no',
                    status: 'visto'
                },
                {
                    emisor: 'YO',
                    hora: '23:12',
                    id: 3,
                    texto: 'Pero ¿y si todo esto… la Matrix dentro de la Matrix?',
                    status: 'visto'
                },
                {
                    emisor: 'USUARIO',
                    hora: '14:19',
                    id: 4,
                    texto: 'Entonces seguiría eligiendo. Porque al final, eso es lo único que nos hace libres.',
                    status: 'no-visto'
                }
            ]
        },
        {
            id: 2,
            name: 'Trinity',
            last_seen: "hoy a las 15:19",
            last_time_connected: '15:19',
            img: "https://upload.wikimedia.org/wikipedia/en/7/7a/MatrixTrinity.jpg",
            last_message: {
                id: 1,
                text: 'Entonces tendría razón. Porque el amor no es parte del código… es un error que vale la pena cometer.'
            },
            unread_messages: 0,
            messages: [
                {
                    emisor: 'YO',
                    hora: '10:30',
                    id: 1,
                    texto: 'Trinity, ¿alguna vez dudaste de Neo?',
                    status: 'visto'
                },
                {
                    emisor: 'USUARIO',
                    hora: '10:35',
                    id: 2,
                    texto: 'Nunca. Lo vi antes de que él mismo lo supiera',
                    status: 'visto'
                },
                {
                    emisor: 'YO',
                    hora: '10:36',
                    id: 3,
                    texto: 'Y si te dijera que el destino no está escrito?',
                    status: 'visto'
                },
                {
                    emisor: 'USUARIO',
                    hora: '15:19',
                    id: 4,
                    texto: 'Entonces tendría razón. Porque el amor no es parte del código… es un error que vale la pena cometer.',
                    status: 'visto'
                }
            ]
        },
        {
            id: 3,
            name: 'Morpheus',
            last_seen: "hoy a las 17:19",
            last_time_connected: '17:19',
            img: "https://upload.wikimedia.org/wikipedia/en/a/ab/Morpheus.jpg",
            last_message: {
                id: 1,
                text: 'Prefiero morir luchando por la libertad que vivir arrodillado en la ilusión'
            },
            unread_messages: 2,
            messages: [
                {
                    emisor: 'YO',
                    hora: '09:00',
                    id: 1,
                    texto: 'Morpheo, ¿qué pasa si la profecía del Elegido fue solo un truco del sistema?',
                    status: 'visto'
                },
                {
                    emisor: 'USUARIO',
                    hora: '09:05',
                    id: 2,
                    texto: 'Importa? La creencia en algo más grande que nosotros… eso es lo que rompe las cadenas.',
                    status: 'visto'
                },
                {
                    emisor: 'YO',
                    hora: '16:45',
                    id: 3,
                    texto: 'Y si estamos todos equivocados?',
                    status: 'visto'
                },
                {
                    emisor: 'USUARIO',
                    hora: '17:19',
                    id: 4,
                    texto: 'Prefiero morir luchando por la libertad que vivir arrodillado en la ilusión.',
                    status: 'no-visto'
                }
            ]
        },
        {
            id: 4,
            name: 'Agent Smith',
            last_seen: "hoy a las 12:30",
            last_time_connected: '12:30',
            img: "https://upload.wikimedia.org/wikipedia/en/1/1f/Agent_Smith_%28The_Matrix_series_character%29.jpg",
            last_message: {
                id: 1,
                text: 'La libertad es una enfermedad. Y yo… (se ajusta el traje) …soy la cura.'
            },
            unread_messages: 3,
            messages: [
                {
                    emisor: 'YO',
                    hora: '08:15',
                    id: 1,
                    texto: 'Smith, ¿por qué odias tanto a Neo?',
                    status: 'visto'
                },
                {
                    emisor: 'USUARIO',
                    hora: '08:16',
                    id: 2,
                    texto: 'Porque él es el espejo en el que veo mi propia… imperfección.',
                    status: 'visto'
                },
                {
                    emisor: 'YO',
                    hora: '08:21',
                    id: 1,
                    texto: 'Y si eres tan libre como él?',
                    status: 'no-visto'
                },
                {
                    emisor: 'USUARIO',
                    hora: '12:30',
                    id: 3,
                    texto: 'La libertad es una enfermedad. Y yo… (se ajusta el traje) …soy la cura.',
                    status: 'visto'
                },
            ]
        },
        {
            id: 5,
            name: 'Oraculo',
            last_seen: "hoy a las 10:32",
            last_time_connected: '10:32',
            img: "https://upload.wikimedia.org/wikipedia/en/c/c5/The_Oracle_%28ii%29.jpg",
            last_message: {
                id: 1,
                text: 'No, cariño. Solo veo lo que necesitas oír. El futuro…'
            },
            unread_messages: 0,
            messages: [
                {
                    emisor: 'YO',
                    hora: '09:15',
                    id: 1,
                    texto: '¿Sabías que estaría aquí hoy?',
                    status: 'visto'
                },
                {
                    emisor: 'USUARIO',
                    hora: '09:16',
                    id: 2,
                    texto: 'Sabía que me harías esa pregunta.',
                    status: 'visto'
                },
                {
                    emisor: 'YO',
                    hora: '09:21',
                    id: 1,
                    texto: 'puedes ver el futuro?',
                    status: 'visto'
                },
                {
                    emisor: 'USUARIO',
                    hora: '09:42',
                    id: 3,
                    texto: 'No, cariño. Solo veo lo que necesitas oír. El futuro…',
                    status: 'visto'
                },
            ]
        }
    ]
}


export default messenger_data;

