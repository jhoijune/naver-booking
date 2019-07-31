module.exports = (sequelize,DataTypes) => {
    return sequelize.define("product",{
        description:{
            type: DataTypes.STRING(100),
            allowNull: true,
            defaultValue: null,
        },
        content:{
            type: DataTypes.TEXT,
            allowNull: true,
            defaultValue: null,
        },
        event:{
            type: DataTypes.STRING(4000),
            allowNull: true,
            defaultValue: null,
        },
        create_date:{
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: null,
        },
        modify_date:{
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: null,
        },
    },{
        freezeTableName: true,
        timestamps: false,
        charset:"utf8",
        collate: "utf8_general_ci",
    })
};