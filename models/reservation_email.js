module.exports = (sequelize,DataTypes) => {
    return sequelize.define("reservation_email",{
        email: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        is_admin: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        }
    },{
        freezeTableName: true,
        timestamps: false,
        charset:"utf8",
        collate: "utf8_general_ci",
    })
};