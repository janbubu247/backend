const magicnum = {
    EmployeeStatus: {
        Active: 1, // == Идэвхтэй
        InActive: 0 // == Идэвхгүй
    },
    ApiErrorType: {
        CatchError: 0 // == Try catch дээрх лог төрөл
    },
    Status: {
        Active: 1,
        InActive: 0
    },
    DOrder: {
        Active: 1,
        InActive: 0
    },
    DLevel: [
        { percent: 40, level: 0 },
        { percent: 45, level: 1 },
        { percent: 50, level: 2 },
        { percent: 55, level: 2 },
        { percent: 60, level: 3 },
        { percent: 65, level: 4 }
    ]
};

module.exports = magicnum;