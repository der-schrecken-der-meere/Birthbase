import React from 'react'
import PageWrapper from '../components/PageWrapper'
import { ThemeContext, useTheme } from "../components/ThemeProvider";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Label } from "@/components/ui/label"
import { Switch } from '@/components/ui/switch';

const Settings = () => {
    const { theme, setTheme } = useTheme();

    // theme === "dark" ? true : false
    // onClick={(isActive) => {
    //     toggleTheme()
    //     return !isActive;
    // }}

    return (
        <PageWrapper title='Einstellungen' className='flex flex-col gap-4'>
            <div className='flex gap-[15px] items-center'>
                <Label className="text-base font-light" htmlFor="msg">Benachrichtigungen erlauben</Label>
                <Switch id="msg"/>
            </div>
            <div className='flex gap-[15px] items-center'>
                {/* <label htmlFor='mode' className='uppercase font-light text-base w-min'>Modus</label> */}
                <Label className="flex gap-4 items-center text-base font-light">Modus
                    <Select defaultValue={theme} onValueChange={(v) => {setTheme(v)}} >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Modus" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                            <SelectItem value="dark">Dunkel</SelectItem>
                            <SelectItem value="light">Hell</SelectItem>
                            <SelectItem value="system">System</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </Label>
            </div>
            {/* <div className='flex gap-[15px] items-center'>
                <Label className="flex gap-4 items-center text-base font-light">Design
                    <Select defaultValue='normal' id="mode" >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Design" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="normal">Normal</SelectItem>
                                <SelectItem value="glass">Glass</SelectItem>
                                <SelectItem value="neu">Neu</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </Label>
            </div> */}
        </PageWrapper>
    )
}

export default Settings