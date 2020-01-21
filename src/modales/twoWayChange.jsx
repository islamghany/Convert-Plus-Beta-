import React, { useState } from "react";
import AsyncSelect from "react-select/async";
import Select from "./select";
import { useForm } from "react-hook-form";
var patterns = new Map();
patterns.set("decimal", "[-0-9]+");
patterns.set("binary", "[0-1]+");
patterns.set("octal", "[0-7]+");
patterns.set("hexa", "[0-9A-Fa-f]+");

const types = [
  { value: "binary", label: "Binary" },
  { value: "decimal", label: "Decimal" },
  { value: "hexa", label: "Hexadecimal" }
];
const ops = [
  { value: "add", label: "add" },
  { value: "sub", label: "sub" }
];
const TwoWayChange = () => {
  const [type, setType] = useState("binary");
  const [operator, setOperator] = useState("add");
  const [flags, setFlags] = useState({ c: 0, s: 0, o: 0, z: 0 });
  const [ans, setAns] = useState("");
  const { register, handleSubmit } = useForm();

  const getResult = (opnd1, opnd2, cflage = 0, conv, ans) => {

    let cin = cflage,
      s = 0,
      zf = 0,
      o = 0,
      cout = 0;
    let ret = "";
    for (let i = opnd1.length - 1; i >= 0; i--) {
      cout = cin;
      zf |= opnd1[i] | opnd2[i];
      if (cin === 0) {
        cin = opnd1[i] & opnd2[i];
        ret += opnd1[i] ^ opnd2[i];
      } else {
        cin = (cin & opnd1[i]) | ((1 ^ opnd1[i]) & opnd2[i]);
        ret += 1 ^ opnd1[i] ^ opnd2[i];
      }
    }
    ret = ret
      .split("")
      .reverse()
      .join("");
    let j = ret[0];
    let b = ret.includes("1") ^ 1;
    if (conv === 10) {
      setAns(ans);
      j = ans >= 0 ? "0" : "1";
      b = ans === 0 ? 1 : 0;
    }
    if (conv === 16) {
      j = ret[0] <= 7 ? 0 : 1;
    } else setAns(ret.toString(conv));
    setFlags({
      c: cin,
      o: cin ^ cout,
      z: b,
      s: j
    });
  };
  const flip = opnd => {
    let num = Math.abs(opnd);
    let res =
      num ^ parseInt(new Array(num.toString(2).length + 1).join("1"), 2);
    return (res + 1).toString(2);
  };
  const onSubmit = ({ opnd1, opnd2 }) => {
    let zr = Math.abs(opnd1.length - opnd2.length);
    let a = opnd1 >= 0 ? 0 : 1,
      b = opnd2 >= 0 ? 0 : 1,
      o1 = opnd1,
      o2 = opnd2;
    if (type === "decimal") {
      if (opnd1 < 0) {
        opnd1 = flip(opnd1);
      } else {
        opnd1 = parseInt(opnd1).toString(2);
      }
      if (opnd2 < 0) {
        opnd2 = flip(opnd2);
      } else {
        opnd2 = parseInt(opnd2).toString(2);
      }
      let f = Math.abs(opnd1.length - opnd2.length);
      if (opnd1.length > opnd2.length) opnd2 = `${b}`.repeat(f) + opnd2;
      else if (opnd1.length < opnd2.length) opnd1 = `${a}`.repeat(f) + opnd1;
      if (operator === "add") {
        getResult(opnd1, opnd2, 0, 10, parseInt(o1) + parseInt(o2));
      } else {
        getResult(opnd1, opnd2, 0, 10, parseInt(o1) - parseInt(o2));
      }
    } else if (type === "binary") {
      if (operator === "add") {
        if (zr !== 0) {
          if (opnd1.length < opnd2.length) opnd1 = "0".repeat(zr) + opnd1;
          else opnd2 = "0".repeat(zr) + opnd2;
        }
        getResult(opnd1, opnd2, 0, 2);
      } else {
        let x = parseInt(parseInt(opnd2, 2).toString(10));
        let result =
          x ^ parseInt(new Array(x.toString(2).length + 1).join("1"), 2);
        let v = "";
        v += parseInt(result, 10).toString(2);
        if (opnd2.length > v.length)
          opnd2 = "0".repeat(opnd2.length - v.length) + v;
        if (opnd1.length > opnd2.length)
          opnd2 = "1".repeat(opnd1.length - opnd2.length) + opnd2;
        else if (opnd1.length < opnd2.length) {
          opnd1 = "0".repeat(opnd2.length - opnd1.length) + opnd1;
        }
        getResult(opnd1, opnd2, 1, 2);
      }
    } else if (type === "hexa") {
      let mp = new Map();
      mp.set("0", 0);
      mp.set("1", 1);
      mp.set("2", 2);
      mp.set("3", 3);
      mp.set("4", 4);
      mp.set("5", 5);
      mp.set("6", 6);
      mp.set("7", 7);
      mp.set("8", 8);
      mp.set("9", 9);
      mp.set("A", 10);
      mp.set("B", 11);
      mp.set("C", 12);
      mp.set("D", 13);
      mp.set("E", 14);
      mp.set("F", 15);
      mp.set(10, "A");
      mp.set(11, "B");
      mp.set(12, "C");
      mp.set(13, "D");
      mp.set(14, "E");
      mp.set(15, "F");
      opnd1 = opnd1.toUpperCase();
      opnd2 = opnd2.toUpperCase();
      let cin = 0,
        zff = 1,
        ov = 0,
        cout = 0,
        ret = "";
      if (opnd2.length > opnd1.length) opnd1 = "0".repeat(zr) + opnd1;
      else if (opnd2.length < opnd1.length) opnd2 = "0".repeat(zr) + opnd2;

      if (operator === "add") {
        for (let i = opnd1.length - 1; i >= 0; i--) {
          let exp = 0;
          cout = cin;
          if (cin == 0) {
            exp = mp.get(opnd1[i]) + mp.get(opnd2[i]);
            if (exp > 15) {
              exp = Math.ceil(exp % 16);
              cin = 1;
            }
          } else {
            let b = mp.get(opnd1[i]);
            if (b === 15) {
              b = 0;
              cin = 1;
            } else {
              b++;
              cin = 0;
            }
            exp = b + mp.get(opnd2[i]);
            if (exp > 15) {
              exp = Math.ceil(exp % 16);
              cin = 1;
            }
          }
          if (exp > 9) ret += mp.get(exp);
          else ret += exp;
          if (exp !== 0) zff = 0;
        }
      } else {
        for (let i = opnd1.length - 1; i >= 0; i--) {
          let exp = 0;
          cout = cin;
          if (cin == 0) {
            exp = mp.get(opnd1[i]) - mp.get(opnd2[i]);
            if (exp < 0) {
              exp += 16;
              cin = -1;
            }
          } else {
            let b = mp.get(opnd1[i]);
            if (b === 0) {
              b = 15;
            } else {
              b--;
              cin = 0;
            }
            exp = b - mp.get(opnd2[i]);
            if (exp < 0) {
              exp += 16;
              cin = -1;
            }
          }
          if (exp > 9) ret += mp.get(exp);
          else ret += exp;
          if (exp !== 0) zff = 0;
        }
        cin = cin === -1 ? 1 : 0;
        cout = cout === -1 ? 1 : 0;
      }
      ret = ret
        .split("")
        .reverse()
        .join("");
      setAns(ret);

      setFlags({
        c: cin,
        o: cin ^ cout,
        z: zff,
        s: operator === "sub" && cin ? 1 : 0
      });
    } else {
    }
  };

  const handleTypeChange = e => {
    setType(e.value);
  };
  const handleOperatorChange = e => {
    setOperator(e.value);
  };
  return (
    <div className="box__mixed">
      <div className="box__select">
        <Select handleChange={handleTypeChange} options={types} />
        <Select handleChange={handleOperatorChange} options={ops} />
      </div>
      <div className="box__inputs">
        <form onSubmit={handleSubmit(onSubmit)}>
          <input
            type="text"
            pattern={patterns.get(type)}
            autoComplete="off"
            name="opnd1"
            required
            ref={register}
          />
          <div className="ops">{operator === "add" ? "+" : "-"}</div>
          <input
            type="text"
            pattern={patterns.get(type)}
            autoComplete="off"
            name="opnd2"
            required
            ref={register}
          />
          <button className="btn btn--contained-primary">ans</button>
        </form>
      </div>
      <div className="box__outputs">
        <div className="box__outputs--ans">= {ans}</div>
        <div className="box__outputs--flags">
          <span>CF={flags.c}</span>
          <span>OF={flags.o}</span>
          <span>SF={flags.s}</span>
          <span>ZF={flags.z}</span>
        </div>
      </div>
    </div>
  );
};

export default TwoWayChange;
