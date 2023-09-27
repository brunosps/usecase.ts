import { RegistraUsuario, RegistraUsuarioOutPut, UsuarioDto } from "./support";


describe('Use Case Test', () => {


    it('RegistraUsuario.call to be truthy', () => {
        const result = RegistraUsuario.call<UsuarioDto, RegistraUsuarioOutPut>({ nome: "Bruno" });

        expect(result.isSuccess()).toBeTruthy();
        expect(result.data).toEqual({ id: 1 })
        expect(result.context).toEqual({ nome: 'Bruno', id: 1 })
    });

    it('RegistraUsuario.call to be falsy', () => {
        const result = RegistraUsuario.call<UsuarioDto, RegistraUsuarioOutPut>({ nome: "" });

        expect(result.isSuccess()).toBeFalsy();
    });

    it('', () => {        
        const result = RegistraUsuario.call<UsuarioDto, RegistraUsuarioOutPut>({ nome: "" });

        expect(result.isSuccess()).toBeFalsy();
    });
})