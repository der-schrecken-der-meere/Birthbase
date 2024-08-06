import { useDispatch, useSelector } from 'react-redux'

import PageWrapper from '@/components/PageWrapper'
import { NavigationEntry, SelectAsRadio, SelectShortend } from '../Settings';

import { setIDBMode, type Mode } from '../../../store/mode/modeSlice'
import { getMediaScreen } from '../../../store/mediaType/mediaTypeSlice'
import { setIDBColor, type Color } from '../../../store/color/colorSlice'

import { Separator } from '../../../components/ui/separator'
import { AppDispatch, RootState } from '@/store/store';

const Appearance = () => {
    return (
        <PageWrapper goBack={1} title='Aussehen'>
            <NavigationEntry
                rightElement={<ModeSelect/>}
                caption={"Ändert das Farbschema"}
            >
                Modus
            </NavigationEntry>
            <Separator/>
            <NavigationEntry
                rightElement={<ColorSelect/>}
                caption={"Ändert die Farbpalette"}
            >
                Farbe
            </NavigationEntry>
        </PageWrapper>
    ) 
}

const ModeSelect = () => {
    const mode = useSelector((state: RootState) => state.mode.value);
    const dispatch = useDispatch<AppDispatch>();
    const lg = useSelector((state: RootState) => {
        const screens = state.mediaType.screens;
        return getMediaScreen("md", screens)?.screen?.isActive as boolean;
    });

    const values = [
        {text: "Dunkel", value: "dark"},
        {text: "Hell", value: "light"},
        {text: "System", value: "system"},
    ];
    const text = "Modus"
    const onChange = (v: string) => dispatch(setIDBMode(v as Mode));
    const ariaLabel = "theme-toggle"

    return (
        !lg ? (
            <SelectAsRadio 
                text={text}
                values={values}
                defaultValue={mode}
                onValueChange={onChange}
            />
        ) : (
            <SelectShortend
                text={text}
                values={values}
                defaultValue={mode}
                onValueChange={onChange}
                ariaLabel={ariaLabel}
            />
        )
    );
}

const ColorSelect = () => {
    const color = useSelector((state: RootState) => state.color.value);
    const dispatch = useDispatch<AppDispatch>();
    const lg = useSelector((state: RootState) => {
        const screens = state.mediaType.screens;
        return getMediaScreen("md", screens)?.screen?.isActive as boolean;
    });

    const values = [
        {text: "Blau", value: "blue"},
        {text: "Grau", value: "gray"},
        {text: "Grün", value: "green"},
        {text: "Lila", value: "purple"},
        {text: "Orange", value: "orange"},
        {text: "Rot", value: "red"},
    ];
    const text = "Farbe"
    const onChange = (v: string) => dispatch(setIDBColor(v as Color));
    const ariaLabel = "color-palette-toggle"

    return (
        !lg ? (
            <SelectAsRadio 
                text={text}
                values={values}
                defaultValue={color}
                onValueChange={onChange}
            />
        ) : (
            <SelectShortend
                text={text}
                values={values}
                defaultValue={color}
                onValueChange={onChange}
                ariaLabel={ariaLabel}
            />
        )
    );
}
export default Appearance