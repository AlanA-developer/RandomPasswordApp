<?php

require_once __DIR__ . '/vendor/autoload.php';

use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Style\Font;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Border;

class ExcelExporter
{
    /**
     * Generate and stream an .xlsx file to the browser.
     *
     * @param array  $passwords  Array of ['plain' => ..., 'hashed' => ...] items
     * @param string $method     Encryption method label for the file metadata
     */
    public static function export(array $passwords, string $method): void
    {
        $spreadsheet = new Spreadsheet();
        $sheet       = $spreadsheet->getActiveSheet();
        $sheet->setTitle('Contraseñas');

        $spreadsheet->getProperties()
            ->setCreator('RandomPasswordApp')
            ->setTitle('Contraseñas Temporales')
            ->setDescription("Generado con RandomPasswordApp — método: $method");

        $sheet->getColumnDimension('A')->setWidth(6);
        $sheet->getColumnDimension('B')->setWidth(32);
        $sheet->getColumnDimension('C')->setWidth(72);

        $sheet->setCellValue('A1', '#');
        $sheet->setCellValue('B1', 'Contraseña (Plain)');
        $sheet->setCellValue('C1', 'Contraseña Hasheada (' . strtoupper($method) . ')');

        $headerStyle = [
            'font'      => [
                'bold'  => true,
                'color' => ['argb' => 'FFFFFFFF'],
                'size'  => 11,
            ],
            'fill'      => [
                'fillType'   => Fill::FILL_SOLID,
                'startColor' => ['argb' => 'FF6C63FF'],
            ],
            'alignment' => [
                'horizontal' => Alignment::HORIZONTAL_CENTER,
                'vertical'   => Alignment::VERTICAL_CENTER,
            ],
            'borders'   => [
                'allBorders' => [
                    'borderStyle' => Border::BORDER_THIN,
                    'color'       => ['argb' => 'FF4A41E0'],
                ],
            ],
        ];

        $sheet->getStyle('A1:C1')->applyFromArray($headerStyle);
        $sheet->getRowDimension(1)->setRowHeight(22);

        $rowIndex = 2;
        foreach ($passwords as $idx => $item) {
            $sheet->setCellValue("A{$rowIndex}", $idx + 1);
            $sheet->setCellValue("B{$rowIndex}", $item['plain']);
            $sheet->setCellValue("C{$rowIndex}", $item['hashed']);

            $fillColor = ($idx % 2 === 0) ? 'FFF7F5FF' : 'FFFFFFFF';
            $rowStyle  = [
                'fill'      => [
                    'fillType'   => Fill::FILL_SOLID,
                    'startColor' => ['argb' => $fillColor],
                ],
                'alignment' => [
                    'vertical' => Alignment::VERTICAL_CENTER,
                ],
                'borders'   => [
                    'allBorders' => [
                        'borderStyle' => Border::BORDER_THIN,
                        'color'       => ['argb' => 'FFE0DEFF'],
                    ],
                ],
            ];
            $sheet->getStyle("A{$rowIndex}:C{$rowIndex}")->applyFromArray($rowStyle);

            $sheet->getStyle("A{$rowIndex}")->getAlignment()
                ->setHorizontal(Alignment::HORIZONTAL_CENTER);

            $rowIndex++;
        }

        $sheet->freezePane('A2');

        $lastRow = count($passwords) + 1;
        $sheet->setAutoFilter("A1:C{$lastRow}");

        $filename = 'contraseñas_' . strtolower($method) . '_' . date('Ymd_His') . '.xlsx';

        while (ob_get_level()) ob_end_clean();

        header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        header('Content-Disposition: attachment; filename="' . $filename . '"');
        header('Cache-Control: max-age=0');
        header('Pragma: public');

        $writer = new Xlsx($spreadsheet);
        $writer->save('php://output');
        exit;
    }
}
