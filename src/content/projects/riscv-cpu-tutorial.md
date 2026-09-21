---
title: RV32I CPU Tutorial
summary: >-
  Build and simulate a single-cycle RV32I processor in Verilog, from the
  instruction formats through to a self-checking testbench and waveforms.
category: education
status: active
github: https://github.com/OpenCERV/RISC-V_CPU_Tutorial
maintainers:
  - WilliamHHL
featured: true
order: 5
tags:
  - RISC-V
  - RV32I
  - Verilog
  - Verilator
  - Tutorial
---

Tutorial 1 of the community's teaching material. It is written for readers who
know basic digital logic and Verilog but have not designed a CPU before, and it
keeps the whole path visible: a short assembly program becomes HEX, `$readmemh`
loads the HEX, and the processor executes one instruction per clock cycle.

## What you build

A single-cycle RV32I core in plain Verilog:

- program counter, instruction memory and next-PC logic for branches and jumps
- instruction decoder and immediate generator
- a 32 × 32-bit register file and an ALU
- word-addressed data memory
- a self-checking testbench

The supported instruction set covers the integer and immediate ALU operations,
`LW` / `SW`, the conditional branches, `JAL` / `JALR`, and `LUI` / `AUIPC`.
Memory reads are zero-latency and combinational — the design is meant for
learning and simulation, not as a realistic SRAM interface.

## Running it

The repository is built around Verilator and GTKWave, with a `make sim` target
that ends in a pass/fail report and a waveform you can inspect.

## Structure

Nine tutorial chapters run from the RISC-V basics and RV32I instruction formats
through the single-cycle datapath, the RTL modules, CPU integration, simulation
and running your own programs, ending with exercises. Each chapter has a short
checkpoint, and none of them require pipelining, caches, synthesis or physical
design.

The repository also carries a backend physical-design guide covering
RTL-to-GDS flow concepts, and an `advanced/` track that points to the separate
research work on a five-stage pipelined implementation. Neither is a
prerequisite for the tutorial.

Licensed under Apache-2.0.
