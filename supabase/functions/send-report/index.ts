import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface SendReportRequest {
  email: string;
  reportData: {
    date: string;
    commodities: Array<{
      id: string;
      name: string;
      nameDe: string;
      price: number;
      currency: string;
      unit: string;
      changePercent: number;
      trend: string;
      icon: string;
    }>;
  };
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, reportData }: SendReportRequest = await req.json();

    const commoditiesHtml = reportData.commodities.map(commodity => `
      <tr style="border-bottom: 1px solid #e5e5e5;">
        <td style="padding: 12px; text-align: left;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="font-size: 18px;">${commodity.icon}</span>
            <div>
              <div style="font-weight: 600; color: #1f2937;">${commodity.nameDe}</div>
              <div style="font-size: 14px; color: #6b7280;">${commodity.name}</div>
            </div>
          </div>
        </td>
        <td style="padding: 12px; text-align: right;">
          <div style="font-weight: 600; color: #1f2937;">
            ${commodity.price.toFixed(2)} ${commodity.currency}/${commodity.unit}
          </div>
        </td>
        <td style="padding: 12px; text-align: right;">
          <span style="
            display: inline-flex;
            align-items: center;
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 600;
            background-color: ${commodity.changePercent > 0 ? '#dcfce7' : commodity.changePercent < 0 ? '#fef2f2' : '#f3f4f6'};
            color: ${commodity.changePercent > 0 ? '#166534' : commodity.changePercent < 0 ? '#dc2626' : '#374151'};
          ">
            ${commodity.changePercent > 0 ? '+' : ''}${commodity.changePercent.toFixed(1)}%
          </span>
        </td>
      </tr>
    `).join('');

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Täglicher Rohstoffbericht</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1f2937; max-width: 600px; margin: 0 auto; padding: 20px;">
          
          <div style="text-align: center; margin-bottom: 32px;">
            <h1 style="color: #1f2937; margin-bottom: 8px;">📊 Täglicher Rohstoffbericht</h1>
            <p style="color: #6b7280; margin: 0;">${reportData.date}</p>
          </div>

          <div style="background-color: #f9fafb; padding: 24px; border-radius: 8px; margin-bottom: 24px;">
            <h2 style="color: #1f2937; margin-top: 0; margin-bottom: 16px;">📈 Zusammenfassung der Marktlage</h2>
            <p style="color: #4b5563; margin: 0;">
              Der heutige Handel zeigt gemischte Signale bei den wichtigsten Rohstoffen. 
              Während Butterpreise weiter steigen, verzeichnet Kakao einen Rückgang aufgrund 
              verbesserter Erntebedingungen in Westafrika.
            </p>
          </div>

          <div style="margin-bottom: 24px;">
            <h3 style="color: #1f2937; margin-bottom: 16px;">🥇 Rohstoffpreise im Detail</h3>
            <table style="width: 100%; border-collapse: collapse; background-color: white; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);">
              <thead>
                <tr style="background-color: #f3f4f6;">
                  <th style="padding: 12px; text-align: left; font-weight: 600; color: #374151;">Rohstoff</th>
                  <th style="padding: 12px; text-align: right; font-weight: 600; color: #374151;">Preis</th>
                  <th style="padding: 12px; text-align: right; font-weight: 600; color: #374151;">Änderung</th>
                </tr>
              </thead>
              <tbody>
                ${commoditiesHtml}
              </tbody>
            </table>
          </div>

          <div style="background-color: #eff6ff; padding: 20px; border-radius: 8px; border-left: 4px solid #3b82f6; margin-bottom: 24px;">
            <h4 style="color: #1e40af; margin-top: 0; margin-bottom: 12px;">🔮 Prognose für morgen</h4>
            <p style="color: #1e40af; margin: 0; font-size: 14px;">
              Aufgrund der aktuellen Markttrends erwarten wir eine Stabilisierung der Butterpreise 
              und einen möglichen weiteren Rückgang bei Kakao. Zuckerpreise könnten aufgrund der 
              Dürreschäden in Brasilien weiter steigen.
            </p>
          </div>

          <div style="text-align: center; padding-top: 24px; border-top: 1px solid #e5e7eb;">
            <p style="color: #9ca3af; font-size: 12px; margin: 0;">
              Bericht automatisch generiert am ${new Date().toLocaleString('de-DE')} | 
              KI-gestütztes Rohstoff-Monitoring-System
            </p>
          </div>

        </body>
      </html>
    `;

    const emailResponse = await resend.emails.send({
      from: "BÄKO AI <onboarding@resend.dev>",
      to: [email],
      subject: `📊 Täglicher Rohstoffbericht - ${reportData.date}`,
      html: emailHtml,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, messageId: emailResponse.data?.id }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-report function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);