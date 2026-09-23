import { create } from 'zustand';
const HeaderShow = (set, get) => ({
    data: false,
    changeData: (newData) => {
        set((state) => ({ ...state, data: newData }))
    }
})



const useHeaderShow = create(HeaderShow)

export default useHeaderShow  