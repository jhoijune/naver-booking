module.exports = (sequelize,DataTypes) => {
    return sequelize.define("reservation_info_price",{
        count: {
            type: DataTypes.INTEGER,
            allowNull: false,
        }
    },{
        freezeTableName: true,
        timestamps: false,
        charset:"utf8",
        collate: "utf8_general_ci",
    })
};