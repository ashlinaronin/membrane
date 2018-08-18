import { shallowMount } from "@vue/test-utils";
import VideoScore from "@/components/VideoScore.vue";

describe("VideoScore.vue", () => {
  it("renders props.msg when passed", () => {
    const msg = "new message";
    const wrapper = shallowMount(VideoScore, {
      propsData: { msg }
    });
    expect(wrapper.text()).toMatch(msg);
  });
});
