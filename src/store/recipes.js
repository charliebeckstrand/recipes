import { vuexfireMutations, firestoreAction } from 'vuexfire'
import { db } from '@/db'

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
            return bindFirestoreRef('recipes', db.collection('recipes'))
        }),
        unbindRecipes: firestoreAction(({ unbindFirestoreRef }) => {
            unbindFirestoreRef('recipes')
        })
    }
}
