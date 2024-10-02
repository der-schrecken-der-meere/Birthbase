import { useDispatch, useSelector } from 'react-redux'

import PageWrapper from '@/frontend/components/PageWrapper'
import { NavigationEntry, SelectAsRadio, SelectShortend } from '../Settings';

import { setIDBMode, type Mode } from '@/frontend/store/mode/modeSlice'
import { getMediaScreen } from '@/frontend/store/mediaType/mediaTypeSlice'
import { setIDBColor, type Color } from '@/frontend/store/color/colorSlice'

import { Separator } from '@/frontend/components/ui/separator'
import { AppDispatch, RootState } from '@/frontend/store/store';

import { PaintbrushVertical, Palette } from 'lucide-react';

const Appearance = () => {
    return (
        <PageWrapper goBack={1} title='Aussehen'>
            <NavigationEntry
                icon={<PaintbrushVertical/>}
                rightElement={<ModeSelect/>}
                caption={"Ändert das Farbschema"}
            >
                Modus
            </NavigationEntry>
            <Separator/>
            <NavigationEntry
                icon={<Palette/>}
                rightElement={<ColorSelect/>}
                caption={"Ändert die Farbpalette"}
            >
                Akzentfarbe
            </NavigationEntry>
        </PageWrapper>
    ) 
}

const ModeSelect = () => {
    const mode = useSelector((state: RootState) => state.mode.value);
    const dispatch = useDispatch<AppDispatch>();
    const lg = useSelector((state: RootState) => {
        const screens = state.mediaType.screens;
        return getMediaScreen("md", screens)?.value.isActive;
    });

    const values = [
        {text: "Dunkel", value: "dark"},
        {text: "Hell", value: "light"},
        {text: "System", value: "system"},
    ];
    const text = "Modus";
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
        return getMediaScreen("md", screens)?.value.isActive;
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