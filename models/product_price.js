module.exports = (sequelize,DataTypes) => {
    return sequelize.define("product_price",{
        price_type_name: {
            type: DataTypes.STRING(25),
            allowNull: false,
        },
        price: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        discount_rate: {
            type: DataTypes.DECIMAL,
            allowNull: false,
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