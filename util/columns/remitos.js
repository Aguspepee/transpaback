module.exports = {
    remitoColumns: [
        {
            "id": "remito_numero",
            "numeric": false,
            "disablePadding": true,
            "label": "Remito",
            "width": 10,
            "show": true,
            "placeHolder": "",
            "type": "text",//text, number, date, select, none
            "search": null
        },
        {
            "id": "contrato[0].nombre",
            "numeric": false,
            "disablePadding": true,
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
            "show": false,
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
            "id": "fecha",
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
            "id": "remito_revisado",
            "numeric": false,
            "disablePadding": false,
            "label": "Remito Revisado",
            "width": 60,
            "show": true,
            "placeHolder": "#",
            "type": "select",//text, number, date, select, none
            "search": null
        },
        {
            "id": "remito_revisado_fecha",
            "numeric": false,
            "disablePadding": true,
            "label": "Remito Revisado Fecha",
            "width": 190,
            "show": false,
            "placeHolder": "#",
            "type": "date",//text, number, date, select, none
            "search": null
        },
        {
            "id": "remito_entregado",
            "numeric": false,
            "disablePadding": false,
            "label": "Remito Entregado",
            "width": 60,
            "show": true,
            "placeHolder": "#",
            "type": "select",//text, number, date, select, none
            "search": null
        },
        {
            "id": "remito_entregado_fecha",
            "numeric": false,
            "disablePadding": true,
            "label": "Remito Entregado Fecha",
            "width": 190,
            "show": false,
            "placeHolder": "#",
            "type": "date",//text, number, date, select, none
            "search": null
        },
        {
            "id": "remito_firmado",
            "numeric": false,
            "disablePadding": false,
            "label": "Remito Firmado",
            "width": 60,
            "show": true,
            "placeHolder": "#",
            "type": "select",//text, number, date, select, none
            "search": null
        },
        {
            "id": "remito_firmado_fecha",
            "numeric": false,
            "disablePadding": true,
            "label": "Remito Firmado Fecha",
            "width": 190,
            "show": false,
            "placeHolder": "#",
            "type": "date",//text, number, date, select, none
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
            "id": "certificado_realizado",
            "numeric": false,
            "disablePadding": false,
            "label": "Certificado Realizado",
            "width": 60,
            "show": true,
            "placeHolder": "#",
            "type": "select",//text, number, date, select, none
            "search": null
        },
        {
            "id": "certificado_realizado_fecha",
            "numeric": false,
            "disablePadding": true,
            "label": "Certificado Realizado Fecha",
            "width": 190,
            "show": false,
            "placeHolder": "#",
            "type": "date",//text, number, date, select, none
            "search": null
        },
        {
            "id": "certificado_numero",
            "numeric": true,
            "disablePadding": true,
            "label": "Certificado Número",
            "width": 80,
            "show": true,
            "placeHolder": "#",
            "type": "number",//text, number, date, select, none
            "search": null
        },
        {
            "id": "certificado_finalizado",
            "numeric": false,
            "disablePadding": true,
            "label": "Certificado Finalizado",
            "width": 10,
            "show": false,
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
            "show": false,
            "placeHolder": "#",
            "type": "date",//text, number, date, select, none
            "search": null
        },

    ]
}



