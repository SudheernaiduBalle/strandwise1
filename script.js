function analyzeDNA() {
    let dna = document.getElementById("dnaInput").value.toUpperCase().replace(/[^ATGC]/g, '');
    
    if (dna.length === 0) {
        alert("Please enter a valid DNA sequence.");
        return;
    }

    // Total count
    let totalCount = dna.length;

    // Count individual nucleotides
    let countA = (dna.match(/A/g) || []).length;
    let countT = (dna.match(/T/g) || []).length;
    let countG = (dna.match(/G/g) || []).length;
    let countC = (dna.match(/C/g) || []).length;
    
    // GC content calculation
    let gcContent = ((countG + countC) / totalCount) * 100;

    // Convert DNA to mRNA (T -> U)
    let mRNA = dna.replace(/T/g, "U");

    // Complementary DNA (cDNA) (A<->T, G<->C)
    let cDNA = dna.split("").map(nuc => {
        if (nuc === "A") return "T";
        if (nuc === "T") return "A";
        if (nuc === "G") return "C";
        if (nuc === "C") return "G";
    }).join("");

    // Exon/Intron Identification (Start: ATG, Stop: TAA, TAG, TGA)
    let exonIntronTable = document.getElementById("exonIntronTable");
    exonIntronTable.innerHTML = "";
    let regex = /ATG([ATGC]+?)(TAA|TAG|TGA)/g;
    let match, lastEnd = 0;

    while ((match = regex.exec(dna)) !== null) {
        let start = match.index;
        let end = regex.lastIndex;
        
        if (lastEnd < start) {
            exonIntronTable.innerHTML += `<tr>
                <td>Intron</td>
                <td>${lastEnd + 1}</td>
                <td>${start}</td>
                <td>${dna.substring(lastEnd, start)}</td>
            </tr>`;
        }

        exonIntronTable.innerHTML += `<tr>
            <td>Exon</td>
            <td>${start + 1}</td>
            <td>${end}</td>
            <td>${match[0]}</td>
        </tr>`;

        lastEnd = end;
    }

    if (lastEnd < dna.length) {
        exonIntronTable.innerHTML += `<tr>
            <td>Intron</td>
            <td>${lastEnd + 1}</td>
            <td>${dna.length}</td>
            <td>${dna.substring(lastEnd)}</td>
        </tr>`;
    }

    // ORF Detection
    let orfTable = document.getElementById("orfTable");
    orfTable.innerHTML = "";
    for (let frame = 0; frame < 3; frame++) {
        let orfRegex = /ATG([ATGC]+?)(TAA|TAG|TGA)/g;
        let sequence = dna.substring(frame);
        let orfMatch;
        while ((orfMatch = orfRegex.exec(sequence)) !== null) {
            let orfStart = orfMatch.index + frame + 1;
            let orfEnd = orfRegex.lastIndex + frame;

            orfTable.innerHTML += `<tr>
                <td>Frame ${frame + 1}</td>
                <td>${orfStart}</td>
                <td>${orfEnd}</td>
                <td>${orfMatch[0]}</td>
            </tr>`;
        }
    }

    // Display results
    document.getElementById("totalCount").textContent = totalCount;
    document.getElementById("countA").textContent = countA;
    document.getElementById("countT").textContent = countT;
    document.getElementById("countG").textContent = countG;
    document.getElementById("countC").textContent = countC;
    document.getElementById("gcContent").textContent = gcContent.toFixed(2) + "%";
    document.getElementById("mRNA").textContent = mRNA;
    document.getElementById("protein").textContent = getProteinSequence(mRNA);
    document.getElementById("cDNA").textContent = cDNA;
}

function getProteinSequence(mRNA) {
    let codonTable = {
        "UUU": "Phenylalanine", "UUC": "Phenylalanine", "UUA": "Leucine", "UUG": "Leucine",
        "UCU": "Serine", "UCC": "Serine", "UCA": "Serine", "UCG": "Serine",
        "UAU": "Tyrosine", "UAC": "Tyrosine", "UAA": "Stop", "UAG": "Stop",
        "UGU": "Cysteine", "UGC": "Cysteine", "UGA": "Stop", "UGG": "Tryptophan",
        "CUU": "Leucine", "CUC": "Leucine", "CUA": "Leucine", "CUG": "Leucine",
        "CCU": "Proline", "CCC": "Proline", "CCA": "Proline", "CCG": "Proline",
        "CAU": "Histidine", "CAC": "Histidine", "CAA": "Glutamine", "CAG": "Glutamine",
        "CGU": "Arginine", "CGC": "Arginine", "CGA": "Arginine", "CGG": "Arginine",
        "AUU": "Isoleucine", "AUC": "Isoleucine", "AUA": "Isoleucine", "AUG": "Methionine",
        "ACU": "Threonine", "ACC": "Threonine", "ACA": "Threonine", "ACG": "Threonine",
        "AAU": "Asparagine", "AAC": "Asparagine", "AAA": "Lysine", "AAG": "Lysine",
        "AGU": "Serine", "AGC": "Serine", "AGA": "Arginine", "AGG": "Arginine",
        "GUU": "Valine", "GUC": "Valine", "GUA": "Valine", "GUG": "Valine",
        "GCU": "Alanine", "GCC": "Alanine", "GCA": "Alanine", "GCG": "Alanine",
        "GAU": "Aspartic Acid", "GAC": "Aspartic Acid", "GAA": "Glutamic Acid", "GAG": "Glutamic Acid",
        "GGU": "Glycine", "GGC": "Glycine", "GGA": "Glycine", "GGG": "Glycine"
    };

    let protein = [];
    for (let i = 0; i < mRNA.length - 2; i += 3) {
        let codon = mRNA.substring(i, i + 3);
        protein.push(codonTable[codon] || "Unknown");
    }
    return protein.join(" - ");
}

function reloadPage() {
    document.getElementById("dnaInput").value = "";
    document.getElementById("exonIntronTable").innerHTML = "";
    document.getElementById("orfTable").innerHTML = "";
}
