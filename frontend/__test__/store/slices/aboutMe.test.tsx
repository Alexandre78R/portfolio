import { type FC } from "react";
import { render, screen, fireEvent, act } from '@test-utils';
import { Provider } from "react-redux";
import { store } from "@/store/store";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { setAboutMe, updateAboutMeContent, type AboutMe } from "@/store/slices/aboutMeSlice";

const TestAboutMeSlice: FC = () => {
  const dispatch: ReturnType<typeof useAppDispatch> = useAppDispatch();
  const aboutMe: AboutMe | null = useAppSelector((state) => state.aboutMe.dataAboutMe);

  const handleSetAboutMe = (): void => {
    dispatch(
      setAboutMe({
        id: 1,
        titleEN: "About me",
        titleFR: "À propos de moi",
        descriptionEN: "English description",
        descriptionFR: "Description française",
      })
    );
  };

  const handleUpdateContentEn: () => void = (): void => {
    dispatch(updateAboutMeContent("en"));
  };

  const handleUpdateContentFr: () => void = (): void => {
    dispatch(updateAboutMeContent("fr"));
  };

  const aboutMeTitle: string = (aboutMe as any)?.title ?? "";

  return (
    <div>
      <span data-testid="aboutme-title">{aboutMeTitle}</span>
      <button type="button" onClick={handleSetAboutMe}>set-aboutme</button>
      <button type="button" onClick={handleUpdateContentEn}>update-en</button>
      <button type="button" onClick={handleUpdateContentFr}>update-fr</button>
    </div>
  );
};

describe("AboutMe Slice", () => {
  it("should set and update aboutMe content", () => {
    render(
      <Provider store={store}>
        <TestAboutMeSlice />
      </Provider>
    );

    const titleSpan: HTMLElement = screen.getByTestId("aboutme-title");
    expect(titleSpan.textContent).toBe("");

    const setButton: HTMLButtonElement = screen.getByText("set-aboutme") as HTMLButtonElement;
    const updateEnButton: HTMLButtonElement = screen.getByText("update-en") as HTMLButtonElement;
    const updateFrButton: HTMLButtonElement = screen.getByText("update-fr") as HTMLButtonElement;

    act(() => {
      fireEvent.click(setButton);
    });

    act(() => {
      fireEvent.click(updateEnButton);
    });

    expect(titleSpan.textContent).toBe("About me");

    act(() => {
      fireEvent.click(updateFrButton);
    });

    expect(titleSpan.textContent).toBe("À propos de moi");
  });
});