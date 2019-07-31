module.exports = (sequelize,DataTypes) => {
    return sequelize.define("file_info",{
        file_name:{
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        save_file_name:{
            type: DataTypes.STRING(4000),
            allowNull: false,
        },
        content_type: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        delete_flag: {
            type: DataTypes.INTEGER,
            allowNull: false,
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