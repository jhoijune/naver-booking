module.exports = (sequelize,DataTypes) => {
    return sequelize.define("reservation_user_comment_image",{
    },{
        freezeTableName: true,
        timestamps: false,
        charset:"utf8",
        collate: "utf8_general_ci",
    })
};