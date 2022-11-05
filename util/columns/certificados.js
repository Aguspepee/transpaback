module.exports = {
    certificadoColumns: [
        {
            "id": "certificado_numero",
            "numeric": false,
            "disablePadding": true,
            "label": "Certificado",
            "width": 10,
            "show": true,
            "placeHolder": "",
            "type": "text",//text, number, date, select, none
            "search": null
        }, 
        {
            "id": "contrato[0].nombre",
            "numeric": false,
            "disablePadding": false,
            "label": "Contrato",
            "width": 160,
            "show": true,
            "placeHolder": "-",
            "type": "text",
            "search":null
        },
        {
            "id": "operador[0].nombre",
            "numeric": false,
            "disablePadding": true,
            "label": "operador",
            "width": 10,
            "show": true,
            "placeHolder": "#",
            "type": "text",//text, number, date, select, none
            "search": null
        },
        {
            "id": "planta",
            "numeric": false,
            "disablePadding": true,
            "label": "Planta",
            "width": 10,
            "show": true,
            "placeHolder": "#",
            "type": "text",//text, number, date, select, none
            "search": null
        },
        {
            "id": "certificante",
            "numeric": false,
            "disablePadding": true,
            "label": "Certificante",
            "width": 200,
            "show": false,
            "placeHolder": "-",
            "type": "text",//text, number, date, select, none
            "search": null
        },
        {
            "id": "certificado_realizado_fecha",
            "numeric": false,
            "disablePadding": true,
            "label": "Fecha",
            "width": 190,
            "show": true,
            "placeHolder": "#",
            "type": "date",//text, number, date, select, none
            "search": null
        },
        {
            "id": "certificado_finalizado",
            "numeric": false,
            "disablePadding": true,
            "label": "Certificado Finalizado",
            "width": 10,
            "show": true,
            "placeHolder": "#",
            "type": "select",//text, number, date, select, none
            "search": null
        },
        {
            "id": "certificado_finalizado_fecha",
            "numeric": false,
            "disablePadding": true,
            "label": "Certificado Finalizado Fecha",
            "width": 190,
            "show": true,
            "placeHolder": "#",
            "type": "date",//text, number, date, select, none
            "search": null
        },   
    ]
}



