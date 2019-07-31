module.exports = (sequelize,DataTypes) => {
    return sequelize.define("product_image",{
        type: {
            type: DataTypes.STRING(2),
            allowNull: false,
        },
    },{
        freezeTableName: true,
        timestamps: false,
        charset:"utf8",
        collate: "utf8_general_ci",
    })
};