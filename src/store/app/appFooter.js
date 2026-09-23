import { create } from 'zustand';

const FooterShow = (set, get) => ({
  data: false,
  changeData: (newData) => {
    set((state) => ({ ...state, data: newData }))
  }
})



const useFooterShow = create(FooterShow)
export default useFooterShow;