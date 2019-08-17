module.exports = (sequelize,DataTypes) => {
    return sequelize.define("reservation_email",{
        email: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
    },{
        freezeTableName: true,
        timestamps: false,
        charset:"utf8",
        collate: "utf8_general_ci",
    })
};