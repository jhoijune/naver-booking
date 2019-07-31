module.exports = (sequelize,DataTypes) => {
    return sequelize.define("promotion",{        
    },{
        freezeTableName: true,
        timestamps: false,
        charset:"utf8",
        collate: "utf8_general_ci",
    })
};