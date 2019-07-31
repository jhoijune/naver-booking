module.exports = (sequelize,DataTypes) => {
    return sequelize.define("display_info",{
        opening_hours: {
            type: DataTypes.STRING(400),
        },
        place_name: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        place_lot: {
            type: DataTypes.STRING(100),
            allowNull: true,
            defaultValue: null,
        },
        place_street: {
            type: DataTypes.STRING(100),
            allowNull: true,
            defaultValue: null,
        },
        tel: {
            type: DataTypes.STRING(20),
            allowNull:true,
            defaultValue: null,
        },
        homepage: {
            type: DataTypes.STRING(255),
            allowNull: true,
            defaultValue: null,
        },
        email: {
            type: DataTypes.STRING(255),
            allowNull: true,
            defaultValue: null,
        },
        create_date: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: null,
        },
        modify_date: {
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