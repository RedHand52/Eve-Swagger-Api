import { createAction, handleActions } from 'redux-actions'
import { typeIdToName } from '../commtools/TypeId'
import Config from '../Config'


const defaultState = {
    Id: '',
    Cid: '',
    At: '',
    Rt: '',
    Pre: 'failed',
    Skill: '',
    SkillUpdate: 'failed'
};

export const updateId = createAction('VC_Set_Id');
export const updateCid = createAction('VC_Set_Cid');
export const updateAt = createAction('VC_Set_At');
export const updateRt = createAction('VC_Set_Rt');
export const updatePf = createAction('VC_Set_Pre');
export const updateSk = createAction('VC_Set_Skill')
export const updateSkL = createAction('VC_Set_SkillUpdate')




export default handleActions({
    [updateId]: (state, { payload }) => ({
        ...state,
        Id: payload
    }),
    [updateCid]: (state, { payload }) => ({
        ...state,
        Cid: payload
    }),
    [updateAt]: (state, { payload }) => ({
        ...state,
        At: payload
    }),
    [updateRt]: (state, { payload }) => ({
        ...state,
        Rt: payload
    }),
    [updatePf]: (state, { payload }) => ({
        ...state,
        Pre: payload
    }),
    [updateSk]: (state, { payload }) => ({
        ...state,
        Skill: payload
    }),
    [updateSkL]: (state, { payload }) => ({
        ...state,
        SkillUpdate: payload
    }),

}, defaultState)







export const callingApiPre = () => (dispatch, getState) => {
    fetch('https://esi.tech.ccp.is/v1/characters/' + getState().ViewChr.Cid + '/medals/?datasource=tranquility&token=' + getState().ViewChr.At)
        .then(function (response) {
            if (!response.ok) {
                return fetch(Config.Apisever + '/rf?rf=' + getState().ViewChr.Rt + '&id=' + getState().ViewChr.Id)
                    .then(response => response.json())
                    .then((json) => {
                        dispatch(updateAt(json));
                        dispatch(updatePf('pass'));
                        dispatch(callingEveSkill());
                        console.log("Bad Api Fixed");
                    })
                    .catch(err => {
                        console.log("Theie is a issue with the api calls to both the eve and api sever" + err)
                    });
            } else {
                dispatch(updatePf('pass'));
                dispatch(callingEveSkill());
            }
        })
};

//https://esi.tech.ccp.is/latest/characters/*ID*/skills/?datasource=tranquility&token=*TOKEN*

export const callingEveSkill = () => (dispatch, getState) => {

    fetch('https://esi.tech.ccp.is/latest/characters/' + getState().ViewChr.Cid + '/skills/?datasource=tranquility&token=' + getState().ViewChr.At)
        .then(response => response.json())
        .then(json => {

            var SkillList = (json.skills.map((item, i) => {

                return {
                    skill_id: typeIdToName(item.skill_id),
                    current_skill_level: item.current_skill_level,
                    skillpoints_in_skill: item.skillpoints_in_skill
                }

            }))

            return SkillList

        })
        .then(SkillList => {

            dispatch(updateSk(SkillList))
            dispatch(updateSkL('true'))

        })
        .catch(err => {
            console.log("skill error:" + err)
        });
}

