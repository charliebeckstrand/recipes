import firebase from 'firebase/app'
import 'firebase/firestore'

import { vuexfireMutations, firestoreAction } from 'vuexfire'

export default {
    state: {
        recipes: []
    },
    mutations: {
        ...vuexfireMutations
    },
    actions: {
        getRecipes: firestoreAction(({ bindFirestoreRef }) => {
            // return the promise returned by `bindFirestoreRef`
            return bindFirestoreRef('recipes', firebase.firestore().collection('recipes'))
        }),
        unbindRecipes: firestoreAction(({ unbindFirestoreRef }) => {
            unbindFirestoreRef('recipes')
        })
    }
}
