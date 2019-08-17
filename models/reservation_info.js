module.exports = (sequelize,DataTypes) => {
    return sequelize.define("reservation_info",{
        reservation_name: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        reservation_tel: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        reservation_date: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        cancel_flag: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        create_date:{
            type: DataTypes.DATE,
            defaultValue: null,
        },
        modify_date:{
            type: DataTypes.DATE,
            defaultValue: null,
        },
    },{
        freezeTableName: true,
        timestamps: false,
        charset:"utf8",
        collate: "utf8_general_ci",
    })
};