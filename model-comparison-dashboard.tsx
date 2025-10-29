import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

const ModelComparisonDashboard = () => {
  const [selectedView, setSelectedView] = useState('overview');
  const [selectedDataset, setSelectedDataset] = useState('dataset1');
  const [showRecommendations, setShowRecommendations] = useState(false);

  const dataset1 = {
    name: 'Dataset 1 (9,990 samples)',
    totalSamples: 9990,
    classDistribution: { mednarr: 779, nonMednarr: 9211 },
    distilbert: {
      name: 'DistilBERT-uncased',
      accuracy: 0.9934,
      matches: 9924,
      mismatches: 66,
      classes: {
        mednarr: { precision: 0.93, recall: 0.99, f1: 0.96, support: 779 },
        nonMednarr: { precision: 1.00, recall: 0.99, f1: 1.00, support: 9211 }
      },
      confusionMatrix: { tp: 773, fn: 6, fp: 60, tn: 9151 },
      errors: { mednarrToNonMednarr: 6, nonMednarrToMednarr: 60 }
    },
    longformer: {
      name: 'Longformer-DeBERTa (max length 1536)',
      accuracy: 0.9930,
      matches: 9920,
      mismatches: 70,
      classes: {
        mednarr: { precision: 0.96, recall: 0.95, f1: 0.95, support: 779 },
        nonMednarr: { precision: 1.00, recall: 1.00, f1: 1.00, support: 9211 }
      },
      confusionMatrix: { tp: 737, fn: 42, fp: 28, tn: 9183 },
      errors: { mednarrToNonMednarr: 42, nonMednarrToMednarr: 28 }
    }
  };

  const dataset2 = {
    name: 'Dataset 2 (1,000 samples)',
    totalSamples: 1000,
    classDistribution: { mednarr: 700, nonMednarr: 300 },
    distilbert: {
      name: 'DistilBERT-uncased',
      accuracy: 0.9950,
      matches: 995,
      mismatches: 5,
      classes: {
        mednarr: { precision: 1.00, recall: 0.99, f1: 1.00, support: 700 },
        nonMednarr: { precision: 0.99, recall: 1.00, f1: 0.99, support: 300 }
      },
      confusionMatrix: { tp: 696, fn: 4, fp: 1, tn: 299 },
      errors: { mednarrToNonMednarr: 4, nonMednarrToMednarr: 1 }
    },
    longformer: {
      name: 'Longformer-DeBERTa (max length 1536)',
      accuracy: 0.9620,
      matches: 962,
      mismatches: 38,
      classes: {
        mednarr: { precision: 1.00, recall: 0.95, f1: 0.97, support: 700 },
        nonMednarr: { precision: 0.89, recall: 1.00, f1: 0.94, support: 300 }
      },
      confusionMatrix: { tp: 662, fn: 38, fp: 0, tn: 300 },
      errors: { mednarrToNonMednarr: 38, nonMednarrToMednarr: 0 }
    }
  };

  const currentDataset = selectedDataset === 'dataset1' ? dataset1 : dataset2;

  const determineWinner = (data) => {
    if (!data.distilbert || !data.longformer) return null;
    
    const distilbertFP = data.distilbert.errors.nonMednarrToMednarr;
    const longformerFP = data.longformer.errors.nonMednarrToMednarr;
    
    if (distilbertFP < longformerFP) return 'distilbert';
    if (longformerFP < distilbertFP) return 'longformer';
    return 'tie';
  };

  const winner = determineWinner(currentDataset);

  const prepareMetricsData = (data) => {
    if (!data.distilbert) {
      return [
        { metric: 'Accuracy', Longformer: (data.longformer.accuracy * 100).toFixed(2) },
        { metric: 'Mednarr Precision', Longformer: (data.longformer.classes.mednarr.precision * 100).toFixed(2) },
        { metric: 'Mednarr Recall', Longformer: (data.longformer.classes.mednarr.recall * 100).toFixed(2) },
        { metric: 'Mednarr F1-Score', Longformer: (data.longformer.classes.mednarr.f1 * 100).toFixed(2) }
      ];
    }

    return [
      {
        metric: 'Accuracy',
        DistilBERT: (data.distilbert.accuracy * 100).toFixed(2),
        Longformer: (data.longformer.accuracy * 100).toFixed(2)
      },
      {
        metric: 'Mednarr Precision',
        DistilBERT: (data.distilbert.classes.mednarr.precision * 100).toFixed(2),
        Longformer: (data.longformer.classes.mednarr.precision * 100).toFixed(2)
      },
      {
        metric: 'Mednarr Recall',
        DistilBERT: (data.distilbert.classes.mednarr.recall * 100).toFixed(2),
        Longformer: (data.longformer.classes.mednarr.recall * 100).toFixed(2)
      },
      {
        metric: 'Mednarr F1-Score',
        DistilBERT: (data.distilbert.classes.mednarr.f1 * 100).toFixed(2),
        Longformer: (data.longformer.classes.mednarr.f1 * 100).toFixed(2)
      }
    ];
  };

  const prepareRadarData = (data) => {
    if (!data.distilbert) {
      return [
        { metric: 'Accuracy', Longformer: data.longformer.accuracy * 100 },
        { metric: 'Mednarr Precision', Longformer: data.longformer.classes.mednarr.precision * 100 },
        { metric: 'Mednarr Recall', Longformer: data.longformer.classes.mednarr.recall * 100 },
        { metric: 'Mednarr F1', Longformer: data.longformer.classes.mednarr.f1 * 100 }
      ];
    }

    return [
      {
        metric: 'Accuracy',
        DistilBERT: data.distilbert.accuracy * 100,
        Longformer: data.longformer.accuracy * 100
      },
      {
        metric: 'Mednarr Precision',
        DistilBERT: data.distilbert.classes.mednarr.precision * 100,
        Longformer: data.longformer.classes.mednarr.precision * 100
      },
      {
        metric: 'Mednarr Recall',
        DistilBERT: data.distilbert.classes.mednarr.recall * 100,
        Longformer: data.longformer.classes.mednarr.recall * 100
      },
      {
        metric: 'Mednarr F1',
        DistilBERT: data.distilbert.classes.mednarr.f1 * 100,
        Longformer: data.longformer.classes.mednarr.f1 * 100
      }
    ];
  };

  const prepareErrorData = (data) => {
    if (!data.distilbert) {
      return [
        {
          errorType: 'Mednarr to Non-mednarr',
          Longformer: data.longformer.errors.mednarrToNonMednarr
        },
        {
          errorType: 'Non-mednarr to Mednarr',
          Longformer: data.longformer.errors.nonMednarrToMednarr
        }
      ];
    }

    return [
      {
        errorType: 'Mednarr to Non-mednarr',
        DistilBERT: data.distilbert.errors.mednarrToNonMednarr,
        Longformer: data.longformer.errors.mednarrToNonMednarr
      },
      {
        errorType: 'Non-mednarr to Mednarr',
        DistilBERT: data.distilbert.errors.nonMednarrToMednarr,
        Longformer: data.longformer.errors.nonMednarrToMednarr
      }
    ];
  };

  const overallMetrics = prepareMetricsData(currentDataset);
  const radarData = prepareRadarData(currentDataset);
  const errorTypeData = prepareErrorData(currentDataset);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            OCR Text Classification Model Comparison
          </h1>
          <p className="text-gray-600">
            Binary Classification Performance Analysis - Form Type Recognition
          </p>
          <div className="mt-4 flex gap-2 flex-wrap">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              Dataset: {currentDataset.totalSamples.toLocaleString()} samples
            </span>
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
              Classes: mednarr ({currentDataset.classDistribution.mednarr}) | non-mednarr ({currentDataset.classDistribution.nonMednarr})
            </span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-4 mb-6">
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setSelectedDataset('dataset1')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedDataset === 'dataset1'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Dataset 1 (9,990 samples)
            </button>
            <button
              onClick={() => setSelectedDataset('dataset2')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedDataset === 'dataset2'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Dataset 2 (1,000 samples)
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-4 mb-6">
          <div className="flex gap-2 flex-wrap">
            {['overview', 'metrics', 'errors', 'confusion'].map((view) => (
              <button
                key={view}
                onClick={() => setSelectedView(view)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedView === view
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {view.charAt(0).toUpperCase() + view.slice(1)}
              </button>
            ))}
            <button
              onClick={() => setShowRecommendations(!showRecommendations)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ml-auto ${
                showRecommendations
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {showRecommendations ? 'Hide Recommendations' : 'Show Recommendations'}
            </button>
          </div>
        </div>

        {selectedView === 'overview' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Key Findings</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {currentDataset.distilbert && winner && (
                  <div className={`p-4 rounded-lg border-l-4 ${
                    winner === 'distilbert' ? 'bg-blue-50 border-blue-600' :
                    winner === 'longformer' ? 'bg-green-50 border-green-600' :
                    'bg-gray-50 border-gray-600'
                  }`}>
                    <h3 className={`font-bold mb-2 ${
                      winner === 'distilbert' ? 'text-blue-900' :
                      winner === 'longformer' ? 'text-green-900' :
                      'text-gray-900'
                    }`}>
                      Winner Based on False Positives
                    </h3>
                    <p className="text-sm text-gray-700">
                      {winner === 'distilbert' && 'DistilBERT-uncased has fewer false positives'}
                      {winner === 'longformer' && 'Longformer-DeBERTa has fewer false positives'}
                      {winner === 'tie' && 'Both models have equal false positive rates'}
                    </p>
                    <p className="text-xs text-gray-600 mt-2">
                      False Positives: DistilBERT: {currentDataset.distilbert.errors.nonMednarrToMednarr} | Longformer: {currentDataset.longformer.errors.nonMednarrToMednarr}
                    </p>
                  </div>
                )}
                
                                {selectedDataset === 'dataset2' && !currentDataset.distilbert && (
                  <div className="p-4 bg-amber-50 rounded-lg border-l-4 border-amber-600">
                    <h3 className="font-bold text-amber-900 mb-2">Awaiting DistilBERT Results</h3>
                    <p className="text-sm text-gray-700">
                      Only Longformer-DeBERTa results available for Dataset 2
                    </p>
                  </div>
                )}

                <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-600">
                  <h3 className="font-bold text-green-900 mb-2">Standout Metric</h3>
                  <p className="text-sm text-gray-700">
                    {selectedDataset === 'dataset1' 
                      ? 'DistilBERT achieves 99% recall on mednarr class (only 6 false negatives)'
                      : 'DistilBERT achieves 99.50% accuracy with only 1 false positive and 4 false negatives total'}
                  </p>
                </div>

                                {currentDataset.distilbert && (
                  <div className="p-4 bg-amber-50 rounded-lg border-l-4 border-amber-600">
                    <h3 className="font-bold text-amber-900 mb-2">Trade-off Analysis</h3>
                    <p className="text-sm text-gray-700">
                      {selectedDataset === 'dataset1'
                        ? 'Longformer: Better precision (96% vs 93%) but lower recall (95% vs 99%)'
                        : 'DistilBERT: Higher accuracy (99.50% vs 96.20%) but 1 false positive vs Longformer\'s 0'}
                    </p>
                  </div>
                )}

                <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-600">
                  <h3 className="font-bold text-purple-900 mb-2">Error Pattern</h3>
                  <p className="text-sm text-gray-700">
                    {selectedDataset === 'dataset1'
                      ? 'DistilBERT: More false positives (60 vs 28). Longformer: More false negatives (42 vs 6)'
                      : 'DistilBERT: Minimal errors (1 FP, 4 FN). Longformer: Perfect precision but 38 false negatives'}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Performance Radar</h2>
              <ResponsiveContainer width="100%" height={400}>
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="metric" />
                  <PolarRadiusAxis angle={90} domain={[85, 100]} />
                  {currentDataset.distilbert && (
                    <Radar
                      name="DistilBERT"
                      dataKey="DistilBERT"
                      stroke="#3b82f6"
                      fill="#3b82f6"
                      fillOpacity={0.5}
                    />
                  )}
                  <Radar
                    name="Longformer"
                    dataKey="Longformer"
                    stroke="#10b981"
                    fill="#10b981"
                    fillOpacity={0.5}
                  />
                  <Legend />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {selectedView === 'metrics' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Metric Comparison</h2>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={overallMetrics}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="metric" />
                  <YAxis domain={[85, 100]} />
                  <Tooltip />
                  <Legend />
                  {currentDataset.distilbert && <Bar dataKey="DistilBERT" fill="#3b82f6" />}
                  <Bar dataKey="Longformer" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Detailed Metrics</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Metric
                      </th>
                      {currentDataset.distilbert && (
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          DistilBERT-uncased
                        </th>
                      )}
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Longformer-DeBERTa
                      </th>
                      {currentDataset.distilbert && (
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Difference
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {overallMetrics.map((row, idx) => {
                      const diff = currentDataset.distilbert 
                        ? (parseFloat(row.DistilBERT) - parseFloat(row.Longformer)).toFixed(2)
                        : null;
                      return (
                        <tr key={idx} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {row.metric}
                          </td>
                          {currentDataset.distilbert && (
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                              {row.DistilBERT}%
                            </td>
                          )}
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            {row.Longformer}%
                          </td>
                          {diff !== null && (
                            <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                              parseFloat(diff) > 0 ? 'text-blue-600' : parseFloat(diff) < 0 ? 'text-green-600' : 'text-gray-600'
                            }`}>
                              {parseFloat(diff) > 0 ? '+' : ''}{diff}%
                            </td>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {selectedView === 'errors' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Error Analysis</h2>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={errorTypeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="errorType" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  {currentDataset.distilbert && <Bar dataKey="DistilBERT" fill="#3b82f6" />}
                  <Bar dataKey="Longformer" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className={`grid ${currentDataset.distilbert ? 'md:grid-cols-2' : 'md:grid-cols-1'} gap-6`}>
              {currentDataset.distilbert && (
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">DistilBERT Error Breakdown</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-red-50 rounded">
                      <span className="text-sm font-medium text-gray-700">False Positives</span>
                      <span className="text-lg font-bold text-red-600">{currentDataset.distilbert.errors.nonMednarrToMednarr}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-amber-50 rounded">
                      <span className="text-sm font-medium text-gray-700">False Negatives</span>
                      <span className="text-lg font-bold text-amber-600">{currentDataset.distilbert.errors.mednarrToNonMednarr}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <span className="text-sm font-medium text-gray-700">Total Errors</span>
                      <span className="text-lg font-bold text-gray-800">{currentDataset.distilbert.mismatches}</span>
                    </div>
                  </div>
                  <p className="mt-4 text-sm text-gray-600">
                    Bias: More likely to classify non-mednarr as mednarr
                  </p>
                </div>
              )}

              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Longformer Error Breakdown</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-red-50 rounded">
                    <span className="text-sm font-medium text-gray-700">False Positives</span>
                    <span className="text-lg font-bold text-red-600">{currentDataset.longformer.errors.nonMednarrToMednarr}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-amber-50 rounded">
                    <span className="text-sm font-medium text-gray-700">False Negatives</span>
                    <span className="text-lg font-bold text-amber-600">{currentDataset.longformer.errors.mednarrToNonMednarr}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span className="text-sm font-medium text-gray-700">Total Errors</span>
                    <span className="text-lg font-bold text-gray-800">{currentDataset.longformer.mismatches}</span>
                  </div>
                </div>
                <p className="mt-4 text-sm text-gray-600">
                  {selectedDataset === 'dataset1'
                    ? 'Bias: More likely to miss mednarr cases'
                    : 'Bias: Only false negatives, perfect precision on mednarr'}
                </p>
              </div>
            </div>
          </div>
        )}

        {selectedView === 'confusion' && (
          <div className="space-y-6">
            <div className={`grid ${currentDataset.distilbert ? 'md:grid-cols-2' : 'md:grid-cols-1'} gap-6`}>
              {currentDataset.distilbert && (
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">DistilBERT Confusion Matrix</h3>
                  <div className="grid grid-cols-3 gap-2">
                    <div></div>
                    <div className="text-center text-sm font-medium text-gray-600">Pred: Mednarr</div>
                    <div className="text-center text-sm font-medium text-gray-600">Pred: Non-mednarr</div>
                    
                    <div className="text-sm font-medium text-gray-600">True: Mednarr</div>
                    <div className="bg-green-100 p-4 rounded text-center">
                      <div className="text-2xl font-bold text-green-700">{currentDataset.distilbert.confusionMatrix.tp}</div>
                      <div className="text-xs text-gray-600">TP</div>
                    </div>
                    <div className="bg-red-100 p-4 rounded text-center">
                      <div className="text-2xl font-bold text-red-700">{currentDataset.distilbert.confusionMatrix.fn}</div>
                      <div className="text-xs text-gray-600">FN</div>
                    </div>
                    
                    <div className="text-sm font-medium text-gray-600">True: Non-mednarr</div>
                    <div className="bg-amber-100 p-4 rounded text-center">
                      <div className="text-2xl font-bold text-amber-700">{currentDataset.distilbert.confusionMatrix.fp}</div>
                      <div className="text-xs text-gray-600">FP</div>
                    </div>
                    <div className="bg-green-100 p-4 rounded text-center">
                      <div className="text-2xl font-bold text-green-700">{currentDataset.distilbert.confusionMatrix.tn}</div>
                      <div className="text-xs text-gray-600">TN</div>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Longformer Confusion Matrix</h3>
                <div className="grid grid-cols-3 gap-2">
                  <div></div>
                  <div className="text-center text-sm font-medium text-gray-600">Pred: Mednarr</div>
                  <div className="text-center text-sm font-medium text-gray-600">Pred: Non-mednarr</div>
                  
                  <div className="text-sm font-medium text-gray-600">True: Mednarr</div>
                  <div className="bg-green-100 p-4 rounded text-center">
                    <div className="text-2xl font-bold text-green-700">{currentDataset.longformer.confusionMatrix.tp}</div>
                    <div className="text-xs text-gray-600">TP</div>
                  </div>
                  <div className="bg-red-100 p-4 rounded text-center">
                    <div className="text-2xl font-bold text-red-700">{currentDataset.longformer.confusionMatrix.fn}</div>
                    <div className="text-xs text-gray-600">FN</div>
                  </div>
                  
                  <div className="text-sm font-medium text-gray-600">True: Non-mednarr</div>
                  <div className="bg-amber-100 p-4 rounded text-center">
                    <div className="text-2xl font-bold text-amber-700">{currentDataset.longformer.confusionMatrix.fp}</div>
                    <div className="text-xs text-gray-600">FP</div>
                  </div>
                  <div className="bg-green-100 p-4 rounded text-center">
                    <div className="text-2xl font-bold text-green-700">{currentDataset.longformer.confusionMatrix.tn}</div>
                    <div className="text-xs text-gray-600">TN</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {showRecommendations && (
          <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Recommendations</h2>
            <div className="space-y-3">
              <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-600">
                <h3 className="font-bold text-blue-900 mb-1">Winner for {selectedDataset === 'dataset1' ? 'Dataset 1' : 'Dataset 2'}</h3>
                <p className="text-sm text-gray-700">
                  {selectedDataset === 'dataset1' ? (
                    <span><strong>Longformer-DeBERTa</strong> wins with 28 false positives vs DistilBERT's 60. This is 53% fewer false positives, making it the better choice when minimizing non-mednarr cases incorrectly classified as mednarr.</span>
                  ) : (
                    <span><strong>Longformer-DeBERTa</strong> wins with 0 false positives vs DistilBERT's 1. Longformer achieves perfect precision on mednarr class, though DistilBERT has higher overall accuracy (99.50% vs 96.20%).</span>
                  )}
                </p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-600">
                <h3 className="font-bold text-green-900 mb-1">For Maximizing Recall</h3>
                <p className="text-sm text-gray-700">
                  {selectedDataset === 'dataset1' ? (
                    <span><strong>DistilBERT-uncased</strong> achieves 99% recall on mednarr class, missing only 6 out of 779 cases. It is also likely faster and more resource-efficient.</span>
                  ) : (
                    <span><strong>DistilBERT-uncased</strong> achieves 99% recall on mednarr class with only 4 false negatives out of 700 samples, plus it has 3.3% higher overall accuracy.</span>
                  )}
                </p>
              </div>
              <div className="p-4 bg-amber-50 rounded-lg border-l-4 border-amber-600">
                <h3 className="font-bold text-amber-900 mb-1">Trade-offs Summary</h3>
                <p className="text-sm text-gray-700">
                  {selectedDataset === 'dataset1' ? (
                    <span>Longformer has better precision (fewer false alarms) but misses more actual mednarr cases. DistilBERT catches more mednarr cases but produces more false alarms. Choose based on whether false positives or false negatives are more costly.</span>
                  ) : (
                    <span>Longformer has perfect precision but lower accuracy and recall. DistilBERT has better overall performance (99.50% accuracy) with minimal false positives (only 1). DistilBERT is the better all-around performer on this dataset.</span>
                  )}
                </p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-600">
                <h3 className="font-bold text-purple-900 mb-1">Further Investigation</h3>
                <p className="text-sm text-gray-700">
                  Analyze the specific cases where each model fails to identify patterns. Consider ensemble methods, threshold tuning, or using different models for different document characteristics. The performance varies significantly between datasets, suggesting domain-specific optimization may be beneficial.
                </p>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ModelComparisonDashboard;