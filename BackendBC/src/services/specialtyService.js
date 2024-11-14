const db = require("../models");

let createSpecialty = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.name || !data.imageBase64 || !data.descriptionHTML || !data.descriptionMarkdown) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            } else {
                await db.Specialty.create({
                    name: data.name,
                    image: data.imageBase64,
                    descriptionHTML: data.descriptionHTML,
                    descriptionMarkdown: data.descriptionMarkdown,
                })

                resolve({
                    errCode: 0,
                    errMessage: 'Ok'
                })
            }
        } catch (e) {
            reject(e);
        }
    })
}

let getAllSpecialty = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.Specialty.findAll({

            });
            if (data && data.length > 0) {
                data.map(item => {
                    item.image = Buffer.from(item.image, 'base64').toString('binary');
                    return item;
                })
            }
            resolve({
                errMessage: 'ok',
                errCode: 0,
                data
            })

        } catch (e) {
            reject(e)
        }

    })
}

let getDetailSpecialtyById = async (inputId, location) => {
    try {
        if (!inputId || !location) {
            return {
                errCode: 1,
                errMessage: 'Missing parameter'
            };
        }

        let data = await db.Specialty.findOne({
            where: { id: inputId },
            attributes: ['descriptionHTML', 'descriptionMarkdown'],
        });

        if (data) {
            let doctorSpecialty = [];

            if (location === 'ALL') {
                doctorSpecialty = await db.Doctor_Infor.findAll({
                    where: { specialtyId: inputId },
                    attributes: ['doctorId', 'provinceId'],
                });
            } else {
                doctorSpecialty = await db.Doctor_Infor.findAll({
                    where: {
                        specialtyId: inputId,
                        provinceId: location
                    },
                    attributes: ['doctorId', 'provinceId'],
                });
            }

            data.doctorSpecialty = doctorSpecialty.length ? doctorSpecialty : [];
        } else {
            data = {};
        }

        return {
            errCode: 0,
            errMessage: 'ok',
            data: data
        };
    } catch (e) {
        console.error('Error in getDetailSpecialtyById:', e);
        return {
            errCode: -1,
            errMessage: 'Internal server error'
        };
    }
}


const searchSpecialty = async (query) => {
    if (!query) return [];

    const specialties = await db.Specialty.findAll({
        where: {
            name: {
                [db.Sequelize.Op.like]: `%${query}%`,
            },
        },
    });

    return specialties.map(specialty => ({
        id: specialty.id,
        name: specialty.name,
    }));
};

module.exports = {
    createSpecialty: createSpecialty,
    getAllSpecialty: getAllSpecialty,
    getDetailSpecialtyById: getDetailSpecialtyById,
    searchSpecialty: searchSpecialty
}