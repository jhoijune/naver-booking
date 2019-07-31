module.exports = (sequelize,DataTypes) => {
    return sequelize.define("reservation_user_comment",{
        score: {
            type: DataTypes.DECIMAL,
            allowNull: false,
        },
        comment: {
            type: DataTypes.TEXT,
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