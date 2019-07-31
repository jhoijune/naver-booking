module.exports = (sequelize,DataTypes) => {
    return sequelize.define("display_info_image",{
    },{
        freezeTableName: true,
        timestamps: false,
        charset:"utf8",
        collate: "utf8_general_ci",
    })
};