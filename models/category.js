module.exports = (sequelize,DataTypes) => {
    return sequelize.define("category",{
        name:{
            type: DataTypes.STRING(50),
            allowNull: false,      
        }
    },{
        freezeTableName: true,
        timestamps: false,
        charset:"utf8",
        collate: "utf8_general_ci",
    })
};