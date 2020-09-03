export default function getContainerTypes(type = null) {
    const types = [
        {
            type_size: '20FR',
            desc: '20 FT FLAT RACK',
            size: '20',
            type: 'FR',
        },
        {
            type_size: '20GP',
            desc: "20 FT X 8'6",
            size: '20',
            type: 'GP',
        },
        {
            type_size: '20HC',
            desc: "20 FT X 9'6",
            size: '20',
            type: 'HC',
        },
        {
            type_size: '20HR',
            desc: "20 FT X 9'6",
            size: '20',
            type: 'HR',
        },
        {
            type_size: '20OH',
            desc: "20 FT X 9'6",
            size: '20',
            type: 'OH',
        },
        {
            type_size: '20OT',
            desc: "20 FT X 8'6",
            size: '20',
            type: 'OT',
        },
        {
            type_size: '20RF',
            desc: "20 FT X 8'6",
            size: '20',
            type: 'RF',
        },
        {
            type_size: '20TK',
            desc: "20 FT X 8'6",
            size: '20',
            type: 'TK',
        },
        {
            type_size: '40FR',
            desc: "40 FT X 8'6",
            size: '40',
            type: 'FR',
        },
        {
            type_size: '40GP',
            desc: "40 FT X 8'6",
            size: '40',
            type: 'GP',
        },
        {
            type_size: '40HC',
            desc: "40 FT X 9'6",
            size: '40',
            type: 'HC',
        },
        {
            type_size: '40HF',
            desc: "40 FT X 9'6",
            size: '40',
            type: 'FR',
        },
        {
            type_size: '40HR',
            desc: "40 FT X 9'6",
            size: '40',
            type: 'RF',
        },
        {
            type_size: '40HT',
            desc: "40 FT X 9'6",
            size: '40',
            type: 'HT',
        },
        {
            type_size: '40OT',
            desc: "40 FT X 8'6",
            size: '40',
            type: 'OT',
        },
        {
            type_size: '40PL',
            desc: 'PLAT FORM',
            size: '40',
            type: 'PL',
        },
        {
            type_size: '40RF',
            desc: "40 FT X 8'6",
            size: '40',
            type: 'RF',
        },
        {
            type_size: '45GP',
            desc: "45 FT X 9'611 GENERAL PURPOSE",
            size: '45',
            type: 'GP',
        },
        {
            type_size: '45HC',
            desc: "45 FT X 9'611 HIGH CUBE",
            size: '45',
            type: 'HC',
        },
        {
            type_size: 'CHASSIS',
            desc: 'CHASSIS',
            size: '',
            type: 'CHASSIS',
        },
    ];
    return type ? types.find(c => c.type_size === type) : types;
}